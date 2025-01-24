import React, {useState, useEffect} from 'react'
import './Main.css'


export default function Main() {
 const [productList, setProductList] = useState([
  {id:1,
  productName:'Товар',
  img: 'components/Main/images.jpg',
  price: '200p'
  },
  {id:1,
    productName:'Товар',
    img: 'components/Main/images.jpg',
    price: '200p'
    },
    {id:1,
      productName:'Товар',
      img: 'components/Main/images.jpg',
      price: '200p'
      },
      {id:1,
        productName:'Товар',
        img: 'components/Main/images.jpg',
        price: '200p'
        },
        {id:1,
          productName:'Товар',
          img: 'components/Main/images.jpg',
          price: '200p'
          },
          {id:1,
            productName:'Товар',
            img: 'components/Main/images.jpg',
            price: '200p'
            },
            {id:1,
              productName:'Товар',
              img: 'components/Main/images.jpg',
              price: '200p'
              },
]) 
  return (
   <>
   <main>
      {productList.map((productItem) =>(
        <div className="product">
          <img src={productItem.img} alt="" />
          <p className='itemName'>{productItem.productName}</p>
          <p className='itemPrice'>{productItem.price}</p>
          <button className='orderB'>В корзину</button>
        </div>
      ) )}
   </main>
   </>
  )
}
