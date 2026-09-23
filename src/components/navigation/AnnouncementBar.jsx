import React from 'react';
import styles from './AnnouncementBar.module.css';

const AnnouncementBar = () => {
  return (
    <div className={styles.bar}>
      <p className={styles.text}>FREE SHIPPING ON ALL ORDERS OVER ₹5,000 | COMPLIMENTARY RETURNS</p>
    </div>
  );
};

export default AnnouncementBar;
