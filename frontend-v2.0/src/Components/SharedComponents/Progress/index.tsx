import React from "react";
import './style.css';
import { useTranslation } from "react-i18next";
import { Level } from "src/api/constants";

const Progress = ({ done }) => {
  const { t } = useTranslation(['main'])
  const [style, setStyle] = React.useState({});

  setTimeout(() => {
    const newStyle = {
      opacity: 1,
      width: `${(done + 1) * 20}%`
    }

    setStyle(newStyle);
  }, 200);

  return (
    <div className="progress">
      <div className="progress-done" style={style}>
        {t(`${Level[done]}`)}
      </div>
    </div>
  )
}

export default Progress;
