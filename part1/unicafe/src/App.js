import { useState } from 'react'

const Title = ({text}) => <h1>{text}</h1>

const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>

const StatisticLine = ({text, value}) => {
  return(
    <tr>
      <td>{text}</td> 
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  if(good!==0 || neutral!==0 || bad!==0) {
    return (
    <div>
      <table>
        <tbody>
          <StatisticLine text="good" value ={good} />
          <StatisticLine text="neutral" value ={neutral} />
          <StatisticLine text="bad" value ={bad} />
          <StatisticLine text="all" value={good + neutral + bad} />
          <StatisticLine text="average" value={(good - bad) / (good + neutral + bad)} />
          <StatisticLine text="positive" value={(good / (good + neutral + bad)) * 100 + "%"} />
        </tbody>
      </table>
    </div>
    )
  }
  return (
    <div><p>No feedback given</p></div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleClickGood = () => setGood(good + 1)

  const handleClickNeutral = () => setNeutral(neutral + 1)

  const handleClickBad = () => setBad(bad + 1)

  return (
    <div>
      <Title text="give feedback"></Title>
      <Button handleClick={handleClickGood} text="good" />
      <Button handleClick={handleClickNeutral} text="neutral" />
      <Button handleClick={handleClickBad} text="bad" />
      <Title text="statistics"></Title>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App