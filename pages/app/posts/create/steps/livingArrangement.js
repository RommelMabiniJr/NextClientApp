import React, { useState } from "react";
import Head from 'next/head'
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { CascadeSelect } from 'primereact/cascadeselect';

export default function Home() {
  
  const [selectedArrangement, setSelectedArrangement] = useState(null);
  const livingArrangements = [
    {
      optName: 'Select a Living Arrangement',
    },
    {
      name: 'Live-in',
      code: 'l-i',
      livingOptions: [
        {optName: 'Live-in with own quarters', code: 'li-oquart'},
        {optName: 'Live-in with shared quarters', code: 'li-shquart'},
        {optName: 'Live-in with separate entrance', code: 'li-sepent'}
      ]
    },
    {
      name: 'Live-out',
      code: 'l-o',
      livingOptions: [
        {optName: 'Live-out with own transportation', code: 'lo-transport'},
        {optName: 'Live-out with stipend', code: 'lo-stip'},
        {optName: 'Live-in with shared quarters', code: 'lo-squarters'},
      ]
    }
];
  return (
    <>
      <Head>
        <title>Living Arrangements</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Content Here */}
      <div>
        <div className="card p-fluid">
          <h5>What dates do you need Care?</h5>
          <div className="formgrid grid">
            <div className="field col">
              <label htmlFor="jobStartDate">Job Starting Date</label>
              <Calendar showIcon />
            </div>
            <div className="field col">
              <label htmlFor="jobStartTime">Job Starting Time</label>
              <Calendar timeOnly hourFormat='12' />
            </div>
          </div>
          <div className="formgrid grid">
            <div className="field col">
              <label htmlFor="jobEndDate">Job Ending Date</label>
              <Calendar showIcon />
            </div>
            <div className="field col">
              <label htmlFor="jobEndTime">Living Arrangements</label>
              <CascadeSelect value={selectedArrangement} onChange={(e) => setSelectedArrangement(e.value)} options={livingArrangements}
              optionLabel="optName" optionGroupLabel="name" optionGroupChildren={['livingOptions']}
              placeholder="Select a Living Arrangement" />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-content-between gap-2 mt-4">
          <Button label="Back" icon="pi pi-arrow-left" iconPos="left" />
          <Button label="Continue" icon="pi pi-arrow-right" iconPos="right" />
        </div>
      </div>
    </>
  )
}