import { MdKeyboardArrowDown } from "react-icons/md";

const Dropdown = ({ label, value, options, onSelect, condition }: any) => (
  <div
    tabIndex={0}
    className="relative group cursor-pointer w-full max-w-xl space-y-1"
  >
    <label>{label}</label>
    <div
      tabIndex={0}
      className={`flex items-center justify-between py-2 px-4 rounded-full bg-transparent border ${
        condition
          ? "border-white focus:ring-1 focus:ring-bluePrimary"
          : "border-darkSecondary"
      }`}
    >
      <input
        className="bg-transparent outline-none w-full"
        value={value || ""}
        disabled
      />
      <MdKeyboardArrowDown className="h-4 w-4" />
    </div>
    {condition && (
      <ul className="bg-darkSecondary shadow-md z-10 rounded-lg inset-x-0 hidden group-focus-within:block absolute -bottom-1 translate-y-full max-h-48 overflow-y-auto">
        {options.map((option: any) => (
          <li
            key={option}
            onClick={() => onSelect(option)}
            className="p-2 hover:bg-darkPrimary cursor-pointer border-b last:border-0 last:rounded-b-lg first:rounded-t-lg"
          >
            <p className="line-clamp-1 text-sm">{option}</p>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default Dropdown