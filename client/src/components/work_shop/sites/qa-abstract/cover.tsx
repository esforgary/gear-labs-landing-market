import { useId } from "react";
import "./qa-abstract.scss";

export function QaAbstractCover() {
  const gradient = useId();

  return (
    <svg className="qa-abstract-cover" viewBox="0 0 800 500" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradient} x1="222" y1="129" x2="577" y2="304" gradientUnits="userSpaceOnUse">
          <stop stopColor="#deff57" />
          <stop offset="1" stopColor="#a9eac5" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="#191c24" />
      <path d="M169 0V500M169 58H800" stroke="#343a47" />
      <rect x="20" y="23" width="30" height="30" rx="9" fill="#cafa6c" />
      <path d="m28 37 5 5 10-12" stroke="#172018" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <g fontFamily="Arial, sans-serif">
        <text x="60" y="43" fill="#eff3fc" fontSize="20" fontWeight="700">QA Path</text>
        <text x="20" y="89" fill="#8491ab" fontSize="9" letterSpacing="2">МОЁ ОБУЧЕНИЕ</text>
        {[
          ["Обзор", "#cafa6c"], ["Теория QA", "#91c6ff"], ["Jira и TestRail", "#ffb36f"],
          ["Web и API", "#c0a4ff"], ["SQL и базы данных", "#71d2c4"], ["Git и Linux", "#eab6e7"],
          ["Python", "#f4ca73"], ["Автотесты и CI/CD", "#8fbcff"],
        ].map(([label, color], index) => (
          <g key={label}>
            {index === 0 && <rect x="12" y={105 + index * 35} width="145" height="29" rx="8" fill="#303b2d" />}
            <rect x="24" y={114 + index * 35} width="10" height="10" rx="3" stroke={color} />
            <text x="44" y={123 + index * 35} fill={index === 0 ? "#d4f7a1" : "#b5c0d6"} fontSize="11">{label}</text>
          </g>
        ))}
        <text x="22" y="437" fill="#9ba8c0" fontSize="9">Изучение конспекта</text>
        <rect x="22" y="449" width="122" height="5" rx="2.5" fill="#343d4b" />
        <rect x="22" y="449" width="38" height="5" rx="2.5" fill="#cafa6c" />
        <text x="193" y="34" fill="#98a4bb" fontSize="10">Моё пространство / Конспект</text>
        <rect x="510" y="16" width="230" height="27" rx="8" fill="#242a35" stroke="#394252" />
        <circle cx="525" cy="28" r="4" stroke="#93a0b7" />
        <path d="m528 31 4 4" stroke="#93a0b7" />
        <text x="541" y="33" fill="#93a0b7" fontSize="9">Найти тему или команду</text>
        <circle cx="767" cy="30" r="14" fill="#3b4251" />
        <text x="758" y="34" fill="#d8e4f5" fontSize="10">QA</text>
        <text x="194" y="96" fill="#edf2fb" fontSize="26" fontWeight="700">Ваш путь в QA</text>
        <text x="194" y="117" fill="#95a4be" fontSize="11">Теория, практика и прогресс — в одном пространстве.</text>
        <rect x="194" y="137" width="361" height="178" rx="17" fill={`url(#${gradient})`} />
        <text x="216" y="164" fill="#304b30" fontSize="8" letterSpacing="1.7">УЧИТЕСЬ В СВОЁМ ТЕМПЕ</text>
        <text x="216" y="198" fill="#172018" fontSize="24" fontWeight="700">От основ к практике</text>
        <text x="216" y="222" fill="#365239" fontSize="11">Читайте, пробуйте и отмечайте изученное.</text>
        <rect x="216" y="253" width="139" height="35" rx="10" fill="#19271e" />
        <text x="234" y="275" fill="#efffe1" fontSize="11" fontWeight="700">Продолжить путь →</text>
        <circle cx="491" cy="264" r="31" stroke="#365239" strokeOpacity=".4" />
        <circle cx="491" cy="264" r="45" stroke="#365239" strokeOpacity=".2" />
        <path d="m478 264 9 9 18-21" stroke="#263f2b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="570" y="137" width="207" height="178" rx="17" fill="#232934" stroke="#394353" />
        <text x="588" y="163" fill="#dce7f9" fontSize="13" fontWeight="700">Ваш прогресс</text>
        <circle cx="674" cy="229" r="39" stroke="#3a4352" strokeWidth="8" />
        <path d="M674 190a39 39 0 0 1 37 51" stroke="#a8d961" strokeWidth="8" strokeLinecap="round" />
        <text x="653" y="235" fill="#e3edff" fontSize="22" fontWeight="700">32%</text>
        <text x="620" y="294" fill="#9aaac4" fontSize="10">Каждый шаг имеет значение</text>
        <text x="194" y="347" fill="#e7eefb" fontSize="17" fontWeight="700">Разделы конспекта</text>
        {[
          ["Теория QA", "Термины и методы", "#91c6ff"],
          ["Web и API", "Запросы и ответы", "#c0a4ff"],
          ["SQL и базы данных", "Работа с данными", "#71d2c4"],
        ].map(([title, description, color], index) => (
          <g key={title}>
            <rect x={194 + index * 198} y="364" width="187" height="112" rx="14" fill="#232934" stroke="#394353" />
            <rect x={209 + index * 198} y="378" width="25" height="25" rx="8" fill={color} fillOpacity=".13" />
            <path d={`m${216 + index * 198} 390 4 4 7-9`} stroke={color} strokeWidth="1.7" strokeLinecap="round" />
            <text x={209 + index * 198} y="425" fill="#e5edfa" fontSize="12" fontWeight="700">{title}</text>
            <text x={209 + index * 198} y="443" fill="#97a6bf" fontSize="10">{description}</text>
            <rect x={209 + index * 198} y="458" width="154" height="4" rx="2" fill="#3b4452" />
            <rect x={209 + index * 198} y="458" width={50 - index * 15} height="4" rx="2" fill={color} />
          </g>
        ))}
      </g>
    </svg>
  );
}
