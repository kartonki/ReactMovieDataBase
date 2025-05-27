import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMoneyBill, faTicket } from '@fortawesome/free-solid-svg-icons';
import { calcTime, convertMoney } from '../../../helpers';
import './MovieInfoBar.css';

interface MovieInfoBarProps {
  time: number;
  budget: number;
  revenue: number;
}

const MovieInfoBar: React.FC<MovieInfoBarProps> = ({ time, budget, revenue }) => (
  <div className="rmdb-movieinfobar">
    <div className="rmdb-movieinfobar-content">
      <div className="rmdb-movieinfobar-content-col">
        <FontAwesomeIcon className="fa-time" icon={faClock} size="2x" />
        <span className="rmdb-movieinfobar-info">Running time: {calcTime(time)}</span>
      </div>
      <div className="rmdb-movieinfobar-content-col">
        <FontAwesomeIcon className="fa-budget" icon={faMoneyBill} size="2x" />
        <span className="rmdb-movieinfobar-info">Budget: {convertMoney(budget)}</span>
      </div>
      <div className="rmdb-movieinfobar-content-col">
        <FontAwesomeIcon className="fa-revenue" icon={faTicket} size="2x" />
        <span className="rmdb-movieinfobar-info">Revenue: {convertMoney(revenue)}</span>
      </div>
    </div>
  </div>
)

export default MovieInfoBar;