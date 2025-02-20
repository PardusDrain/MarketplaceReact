import React, {useState, useEffect} from 'react'
import './Main.css'


export default function Main() {
 const [productList, setProductList] = useState([])
useEffect(() => {
  const ProductAPI = 'http://localhost:9001/products'
    fetch(ProductAPI)
    .then(result => result.json())
    .then((result) => {
     setProductList(result.productFetch)
    })
}, [])
  return (
   <>
   <main>
    <div className="imageWrapper">
      {productList.map((productItem) =>(
        <div className="product" key={productItem._id}>
          <img src={productItem.img} alt="" />
          <p className='itemName'>{productItem.productName}</p>
          <p className='itemPrice'>{`${productItem.price}₽`}</p>
          <button className='orderB'>В корзину</button>
        </div>
      ) )}
      </div>
   </main>
   </>
  )
}
