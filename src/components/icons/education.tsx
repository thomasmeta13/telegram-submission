import { IconPropType } from "./agent";

const EducationIcon: React.FC<IconPropType> = (prop) => {
  return (
    <svg
      width={prop.width || "24"}
      height={prop.height || "24"}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_education)">
        <path
          d="M12 2L2 7L12 12L22 7L12 2Z"
          fill={prop.selected ? "#FFFFFF" : "#D3BDDF"}
          fillOpacity={prop.selected ? "1" : "0.7"}
        />
        <path
          d="M2 17L12 22L22 17V7L12 12L2 7V17Z"
          fill={prop.selected ? "#FFFFFF" : "#D3BDDF"}
          fillOpacity={prop.selected ? "1" : "0.7"}
        />
        <path
          d="M6 11.5V16.5L12 19.5L18 16.5V11.5"
          stroke={prop.selected ? "#FFFFFF" : "#D3BDDF"}
          strokeOpacity={prop.selected ? "1" : "0.7"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 22V19.5"
          stroke={prop.selected ? "#FFFFFF" : "#D3BDDF"}
          strokeOpacity={prop.selected ? "1" : "0.7"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_education">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default EducationIcon;
