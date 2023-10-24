import { useState } from "react";
import Link from "next/link";
import styles from "../styles/home.module.css";

const accounting = () => {
  const [transactionType, setTransactionType] = useState("收入");
  const [money, setMoney] = useState("");
  const [item, setItem] = useState("");
  const [total, setTotal] = useState(0);
  //用來接使用者輸入後的東西
  const [transactions, setTransactions] = useState([]);

  //偵測支出＆收入
  const handleTransactionChange = (e) => {
    setTransactionType(e.target.value);
  };

  //偵測金額
  const handleMoneyChange = (e) => {
    setMoney(e.target.value);
  };

  //偵測item
  const handleItemChange = (e) => {
    setItem(e.target.value);
  };

  //確認是支出還是收入->進行計算

  const handleAddTransaction = (e) => {
    e.preventDefault();
    const amount = transactionType === "收入" ? money : -money;
    const newTransaction = { name: item, amount: amount };
    console.log(newTransaction);
    setMoney("");
    setItem("");
    setTransactions([...transactions, newTransaction]);
    setTotal(Number(amount) + Number(total));
  };

  const handleDeleteTransaction = (index) => {
    const deletedTransaction = transactions[index];
    const updatedTransactions = transactions.filter((_, i) => i !== index);
    const deletedAmount = deletedTransaction.amount;
    setTransactions(updatedTransactions);
    setTotal(total - deletedAmount);
  };

  return (
    <div className={styles.accountingApp}>
      <form
        action=""
        className="accounting-form"
        onSubmit={handleAddTransaction}
      >
        <select name="" id="" onChange={handleTransactionChange}>
          <option value="收入">收入</option>
          <option value="支出">支出</option>
        </select>
        <input
          type="number"
          className="moneyInput"
          placeholder="請輸入金額"
          onChange={handleMoneyChange}
          value={money}
          required
        />
        <input
          className={styles.itemInput}
          type="text"
          placeholder="請輸入您的品項"
          value={item}
          onChange={handleItemChange}
          required
        />
        <button type="submit">送出</button>
      </form>
      <div className={styles.space}></div>
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index}>
            <span
              className={
                transaction.amount > 0 ? styles.positive : styles.negative
              }
            >
              {transaction.amount}
            </span>
            {transaction.name}
            <button
              className={styles.deleteBtn}
              onClick={() => handleDeleteTransaction(index)}
            >
              刪除
            </button>
          </li>
        ))}
      </ul>
      <hr />
      <p>總金額：{total}</p>
      <br />
      <br />
      <Link href="/">
        <h3>點我回首頁</h3>
      </Link>
    </div>
  );
};

export default accounting;
