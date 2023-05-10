import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';

export default function EditButton({ isEditMode, toggleEditMode, onSubmit }) {
  const handleSaveButton = async () => {
    try {
      await onSubmit();
    } catch (error) {
      // Handle the error here
      console.error(error);
    }
  }

  return isEditMode ? (
    <div className="p-d-flex p-jc-center">
      <div className={'flex flex-column md:flex-row'}>
        <Button label="Save" className="mr-2 p-mb-2" onClick={handleSaveButton}/>
        <Button label="Cancel" className="p-mb-2 bg-bluegray-600 hover:bg-bluegray-400 border-bluegray-700" onClick={toggleEditMode}/>
      </div>
    </div>
  ) : (
    <Button
      label='Edit'
      className=' p-button-outlined p-button-secondary'
      icon='pi pi-pencil'
      onClick={toggleEditMode}
    />
  );
}
