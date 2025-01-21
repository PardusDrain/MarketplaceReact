import React, {useState} from 'react'
import './Main.css'


export default function Main() {
 const [PRODUCTLIST] = useState([
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
      {PRODUCTLIST.map((productItem) =>(
        <div className="product">
          <img src={productItem.img} alt="" />
          <p>{productItem.productName}</p>
          <button className='orderB'>В корзину</button>
        </div>
      ) )}
   </main>
   </>
  )
}
