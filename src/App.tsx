import React from 'react';
import style from './App.module.scss';

const App = () => {
  return (
    <div className={style.App}>
      <h1>Create an event</h1>
      <section className={style.createEvent}>
        <label htmlFor={'title'}>title</label>
        <input id={'title'} type='text'></input>
        <label htmlFor={'description'}>description</label>
        <textarea id={'description'} rows={5} cols={33}></textarea>
        <label htmlFor={'location'}>location</label>
        <input id={'location'}></input>
        <label htmlFor={'startDate'}>start date</label>
        <input
          type='date'
          id='startDate'
          value='2018-07-22'
          min='2018-01-01'
          max='2018-12-31'
        />
        <label htmlFor='startTime'>Start time</label>
        <input type='time' id='startTime' required></input>
        <label htmlFor={'endDate'}>end date</label>
        <input
          type='date'
          id='endDate'
          value='2018-07-22'
          min='2018-01-01'
          max='2018-12-31'
        />
        <label htmlFor='endTime'>end time</label>
        <input type='time' id='endTime' required></input>
        <label htmlFor={'endDate'}>Open for registration date</label>
        <input
          type='date'
          id='endDate'
          value='2018-07-22'
          min='2018-01-01'
          max='2018-12-31'
        />
        <label htmlFor='endTime'>Open for registration time</label>
        <input type='time' id='endTime' required></input>
        <button>Create</button>
      </section>
    </div>
  );
};

export default App;
