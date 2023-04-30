import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Panel } from 'primereact/panel';
import { classNames } from 'primereact/utils';
import { Divider } from 'primereact/divider';
import EditButton from './components/infoComponents';

const ContactInformation = ({session}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(session.user.phone);
  const [email, setEmail] = useState(session.user.email);

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const renderPhoneNumberField = () => {
    return (
      <div className="p-field">
        <InputText id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
      </div>
    );
  };

  const renderEmailField = () => {
    return (
      <div className="p-field">
        <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
    );
  };


  return (
    <div className="p-d-flex p-jc-between">
      <Panel header="Contact Information" className="p-col-12 p-sm-6 p-md-4">
        <div className='flex flex-row justify-content-between'>
          <div className="panel-fields p-mb-2 col">
            <div className="p-mb-2 grid">
              <div className="col-fixed text-500 w-4 md:w-2 font-medium mr-4">Phone: </div>
              {isEditMode ? renderPhoneNumberField() : <div className="col text-900">{phoneNumber}</div>}
            </div>
            <div className='divider my-3' />
            <div className="p-mb-2 grid">
              <div className="col-fixed text-500 w-4 md:w-2 font-medium mr-4">Email: </div>
              {isEditMode ? renderEmailField() : <div className="col text-900">{email}</div>}
            </div>
          </div>

          <div className='flex-none'>
            <EditButton isEditMode={isEditMode} toggleEditMode={toggleEditMode} />
          </div>
        </div>
      </Panel>
    </div>

  );

};

export default ContactInformation;
