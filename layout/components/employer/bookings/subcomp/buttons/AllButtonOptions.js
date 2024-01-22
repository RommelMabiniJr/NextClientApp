// CancelButton.js
export const CancelButton = ({ onClick }) => (
  <Button
    label="Cancel Booking"
    severity="danger"
    className="w-full"
    size="small"
    onClick={onClick}
  />
);

// ExtendButton.js
export const ExtendButton = ({ onClick }) => (
  <Button
    label="Extend Booking"
    icon="pi pi-external-link"
    className="w-full"
    size="small"
    onClick={onClick}
  />
);

// SendMessageButton.js
export const SendMessageButton = ({ onClick }) => (
  <Button
    label="Send Message"
    icon="pi pi-envelope"
    className="w-full"
    size="small"
    onClick={onClick}
    outlined
  />
);

// ReviewButton.js
export const ReviewButton = ({ onClick, label }) => (
  <Button
    label={label}
    icon="pi pi-star"
    className="w-full"
    onClick={onClick}
    outlined
    size="small"
  />
);
