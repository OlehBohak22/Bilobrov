const FullStar = () => (
  <svg
    className="w-[1.3vw] h-[1.3vw]"
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.0753 5.2468C12.4152 4.42094 13.5848 4.42094 13.9247 5.2468L15.2616 8.49496C15.4054 8.8442 15.7336 9.08267 16.1101 9.11145L19.6124 9.37916C20.5029 9.44723 20.8644 10.5596 20.184 11.1381L17.5079 13.4133C17.2202 13.6579 17.0948 14.0438 17.1838 14.4108L18.0115 17.8244C18.2219 18.6923 17.2756 19.3799 16.5152 18.9115L13.5244 17.0695C13.2029 16.8714 12.7971 16.8714 12.4756 17.0695L9.48481 18.9115C8.72439 19.3799 7.77811 18.6923 7.98855 17.8244L8.81621 14.4108C8.9052 14.0438 8.77983 13.6579 8.49211 13.4133L5.81604 11.1381C5.13564 10.5596 5.49708 9.44723 6.38756 9.37916L9.88986 9.11145C10.2664 9.08267 10.5946 8.8442 10.7384 8.49496L12.0753 5.2468Z"
      fill="black"
    />
  </svg>
);

const HalfStar = () => (
  <svg className="w-[1vw] h-[1.3vw]" viewBox="0 0 24 24">
    <defs>
      <linearGradient id="half" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="50%" stopColor="" />
        <stop offset="50%" stopColor="rgba(0, 0, 0, 0.1)" />
      </linearGradient>
    </defs>
    <path
      fill="url(#half)"
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77 5.82 21l1.18-6.86-5-4.87 6.91-1.01L12 2z"
    />
  </svg>
);

const EmptyStar = () => (
  <svg
    className="w-[1.3vw] h-[1.3vw]"
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.1"
      d="M12.0376 3.8734C12.2076 3.46047 12.7924 3.46047 12.9624 3.8734L14.8131 8.37014C14.885 8.54476 15.0491 8.664 15.2374 8.67839L20.086 9.049C20.5312 9.08304 20.7119 9.63924 20.3717 9.92848L16.667 13.0782C16.5231 13.2005 16.4604 13.3935 16.5049 13.577L17.6508 18.3028C17.756 18.7367 17.2828 19.0805 16.9026 18.8463L12.7622 16.2962C12.6014 16.1972 12.3986 16.1972 12.2378 16.2962L8.09737 18.8463C7.71716 19.0805 7.24402 18.7367 7.34924 18.3028L8.49506 13.577C8.53955 13.3935 8.47687 13.2005 8.333 13.0782L4.62827 9.92848C4.28806 9.63924 4.46879 9.08304 4.91402 9.049L9.7626 8.67839C9.95088 8.664 10.115 8.54476 10.1869 8.37014L12.0376 3.8734Z"
      fill="#1A1A1A"
    />
  </svg>
);

export const StarRating = ({ rating }: { rating: string }) => {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const value = parseFloat(rating);
    if (i + 1 <= value) return <FullStar key={i} />;
    if (i < value && i + 1 > value) return <HalfStar key={i} />;
    return <EmptyStar key={i} />;
  });

  return <div className="flex ">{stars}</div>;
};

// -----------------------------------------------------------------------------------------------------------

const FullStarRed = () => (
  <svg
    className="w-[1.6vw] h-[1.6vw]"
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.0753 5.2468C12.4152 4.42094 13.5848 4.42094 13.9247 5.2468L15.2616 8.49496C15.4054 8.8442 15.7336 9.08267 16.1101 9.11145L19.6124 9.37916C20.5029 9.44723 20.8644 10.5596 20.184 11.1381L17.5079 13.4133C17.2202 13.6579 17.0948 14.0438 17.1838 14.4108L18.0115 17.8244C18.2219 18.6923 17.2756 19.3799 16.5152 18.9115L13.5244 17.0695C13.2029 16.8714 12.7971 16.8714 12.4756 17.0695L9.48481 18.9115C8.72439 19.3799 7.77811 18.6923 7.98855 17.8244L8.81621 14.4108C8.9052 14.0438 8.77983 13.6579 8.49211 13.4133L5.81604 11.1381C5.13564 10.5596 5.49708 9.44723 6.38756 9.37916L9.88986 9.11145C10.2664 9.08267 10.5946 8.8442 10.7384 8.49496L12.0753 5.2468Z"
      fill="rgba(214, 61, 68, 1)"
    />
  </svg>
);

const HalfStarRed = () => (
  <svg className="w-[1.3vw] h-[1.6vw]" viewBox="0 0 24 24">
    <defs>
      <linearGradient id="halfRed" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="50%" stopColor="rgba(214, 61, 68, 1)" />
        <stop offset="50%" stopColor="rgba(26, 26, 26, 0.2)" />
      </linearGradient>
    </defs>
    <path
      fill="url(#halfRed)"
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77 5.82 21l1.18-6.86-5-4.87 6.91-1.01L12 2z"
    />
  </svg>
);

const EmptyStarRed = () => (
  <svg
    className="w-[1.6vw] h-[1.6vw]"
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.1"
      d="M12.0376 3.8734C12.2076 3.46047 12.7924 3.46047 12.9624 3.8734L14.8131 8.37014C14.885 8.54476 15.0491 8.664 15.2374 8.67839L20.086 9.049C20.5312 9.08304 20.7119 9.63924 20.3717 9.92848L16.667 13.0782C16.5231 13.2005 16.4604 13.3935 16.5049 13.577L17.6508 18.3028C17.756 18.7367 17.2828 19.0805 16.9026 18.8463L12.7622 16.2962C12.6014 16.1972 12.3986 16.1972 12.2378 16.2962L8.09737 18.8463C7.71716 19.0805 7.24402 18.7367 7.34924 18.3028L8.49506 13.577C8.53955 13.3935 8.47687 13.2005 8.333 13.0782L4.62827 9.92848C4.28806 9.63924 4.46879 9.08304 4.91402 9.049L9.7626 8.67839C9.95088 8.664 10.115 8.54476 10.1869 8.37014L12.0376 3.8734Z"
      fill="#1A1A1A"
    />
  </svg>
);

export const StarRatingRed = ({ rating }: { rating: string }) => {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const value = parseFloat(rating);
    if (i + 1 <= value) return <FullStarRed key={i} />;
    if (i < value && i + 1 > value) return <HalfStarRed key={i} />;
    return <EmptyStarRed key={i} />;
  });

  return <div className="flex ">{stars}</div>;
};
