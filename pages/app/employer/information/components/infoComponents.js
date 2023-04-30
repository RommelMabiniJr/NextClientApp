import { Button } from 'primereact/button';

export default function EditButton({ isEditMode, toggleEditMode }) {
  return isEditMode ? (
    <div className='flex'>
      <Button
        label='Cancel'
        onClick={toggleEditMode}
        severity='danger'
        className='p-button-rounded p-button-outlined p-button-sm mr-3'
      />
      <Button
        label='Save'
        onClick={toggleEditMode}
        severity='success'
        className='p-button-rounded p-button-outlined p-button-sm'
      />
    </div>
  ) : (
    <Button
      label='Edit'
      className='p-button-rounded p-button-outlined p-button-sm p-button-secondary'
      icon='pi pi-pencil'
      onClick={toggleEditMode}
    />
  );
}
