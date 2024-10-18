import styled from "styled-components";

const FavouriteSVG = styled.svg`
  color: var(--color-primary);
  cursor: pointer;
`;

function FavouriteIcon({ isFavourite }) {
  return (
    <FavouriteSVG
      width="28"
      height="28"
      viewBox="-5 -5 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth={6}
    >
      <path
        d="M58.7188 5.03106C55.662 1.9819 51.5222 0.267202 47.2047 0.261932C42.8871 0.256662 38.7431 1.96124 35.6788 5.00293L32.0001 8.42012L28.3185 4.99168C25.255 1.93676 21.1034 0.223931 16.7771 0.229997C12.4507 0.236062 8.30393 1.96053 5.24901 5.02403C2.19408 8.08752 0.481255 12.2391 0.487321 16.5655C0.493386 20.8919 2.21785 25.0386 5.28135 28.0936L30.411 53.5917C30.6204 53.8043 30.8699 53.9731 31.1452 54.0883C31.4204 54.2036 31.7158 54.2629 32.0142 54.2629C32.3125 54.2629 32.6079 54.2036 32.8831 54.0883C33.1584 53.9731 33.4079 53.8043 33.6173 53.5917L58.7188 28.0936C61.7759 25.0346 63.4932 20.887 63.4932 16.5623C63.4932 12.2376 61.7759 8.08996 58.7188 5.03106Z"
        fill={isFavourite ? "currentColor" : "none"}
      />
    </FavouriteSVG>
  );
}

export default FavouriteIcon;
