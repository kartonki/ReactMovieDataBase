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

interface InfoItemProps {
    icon: typeof faClock | typeof faMoneyBill | typeof faTicket;
    label: string;
    value: string;
    className: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, className }) => (
    <div className="rmdb-movieinfobar-content-col">
        <FontAwesomeIcon className={className} icon={icon} size="2x" />
        <span className="rmdb-movieinfobar-info">{label}: {value}</span>
    </div>
);

const MovieInfoBar: React.FC<MovieInfoBarProps> = ({ time, budget, revenue }) => {
    const infoItems = [
        { icon: faClock, label: 'Running time', value: calcTime(time), className: 'fa-time' },
        { icon: faMoneyBill, label: 'Budget', value: convertMoney(budget), className: 'fa-budget' },
        { icon: faTicket, label: 'Revenue', value: convertMoney(revenue), className: 'fa-revenue' }
    ];

    return (
        <div className="rmdb-movieinfobar">
            <div className="rmdb-movieinfobar-content">
                {infoItems.map((item, index) => (
                    <InfoItem key={index} {...item} />
                ))}
            </div>
        </div>
    );
};

export default MovieInfoBar;