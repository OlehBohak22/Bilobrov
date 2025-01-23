interface ProductInfo {
  name: string;
  images: { src: string; alt: string }[]; // Масив об'єктів
}

interface ProductItemProps {
  info: ProductInfo;
}

export const ProductItem: React.FC<ProductItemProps> = ({ info }) => {
  return (
    <li>
      {info.images.map(
        (
          image,
          index // Перебір масиву images
        ) => (
          <div key={index}>
            <img src={image.src} alt={image.alt || info.name} />
          </div>
        )
      )}
      <p>{info.name}</p>
    </li>
  );
};
