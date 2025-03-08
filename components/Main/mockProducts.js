// Тестовые данные (1000 продуктов)
export const mockProducts = Array.from({ length: 40 }, (_, i) => ({
  _id: i + 1,
  productName: `Тестовый продукт ${i + 1}`,
  price: Math.floor(Math.random() * 1000) + 100,
  img: i % 2 === 0 ? 'sweet.png' : 'sweet2.png',
}));
