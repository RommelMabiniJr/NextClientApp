import { ToggleButton } from 'primereact/togglebutton';
import { Tooltip } from 'primereact/tooltip';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AvailabilityInfo = ({ availability }) => {

    const getIcon = (available) => available ? 'pi pi-sun' : 'pi pi-moon';

    const renderToggleButton = (day) => {
        const available = availability[day];
        console.log(available)
        console.log(day)
        const icon = getIcon(available);
        return (
            <>
                <Tooltip key={day} target={`#${day}`} position="top" content={`${day}: ${available ? 'Available' : 'Not available'}`}>
                </Tooltip>
                <ToggleButton
                    id={day}
                    checked={available}
                    onIcon={icon}
                    offIcon={icon}
                    onLabel=""
                    offLabel=""
                    className={`p-button-rounded p-button-secondary p-mr-2 ${available ? 'bg-primary' : 'bg-secondary'}`}
                />
            </>
        );
    };


    return (
        <div className="p-d-flex p-ai-center">
            {daysOfWeek.map(day => {
                console.log("")
                renderToggleButton(day)
            })}
        </div>
    );
};


export default AvailabilityInfo;