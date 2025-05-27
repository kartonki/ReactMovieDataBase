import React from 'react';
import './LoadMoreBtn.css';

interface LoadMoreBtnProps {
  text: string;
  onClick: () => void;
}

const LoadMoreBtn: React.FC<LoadMoreBtnProps> = ({ text, onClick }) => (
  <div className="rmdb-loadmorebtn" onClick={onClick}>
    <p>{text}</p>
  </div>
)

export default LoadMoreBtn;