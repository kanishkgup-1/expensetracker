import { NextResponse } from 'next/server';
import productsData from '@/data/products.json';

function calculateSimilarity(str1, str2) {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  if (s1.includes(s2) || s2.includes(s1)) {
    return 0.8;
  }
  
  const words1 = s1.split(' ');
  const words2 = s2.split(' ');
  const commonWords = words1.filter(word => words2.includes(word));
  
  if (commonWords.length > 0) {
    return 0.5;
  }
  
  return 0;
}

export async function POST(request) {
  try {
    const { expenses } = await request.json();
    
    if (!expenses || !Array.isArray(expenses)) {
      return NextResponse.json(
        { error: 'Invalid expenses data' },
        { status: 400 }
      );
    }

    const recommendations = [];
    const { products } = productsData;

    for (const expense of expenses) {
      const { title, amount, category } = expense;
      
      const matchingProducts = products.filter(product => {
        const categoryMatch = product.category.toLowerCase() === category.toLowerCase();
        const titleSimilarity = calculateSimilarity(product.name, title);
        const isCheaper = product.price < amount;
        
        return categoryMatch && titleSimilarity > 0.3 && isCheaper;
      });

      const productsWithContext = matchingProducts.map(product => ({
        ...product,
        relatedTo: {
          title,
          category
        }
      }));

      recommendations.push(...productsWithContext);
    }

    const uniqueRecommendations = Array.from(
      new Map(recommendations.map(item => [item.id, item])).values()
    );

    return NextResponse.json({
      success: true,
      recommendations: uniqueRecommendations,
      totalRecommendations: uniqueRecommendations.length
    });

  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
