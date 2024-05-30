import React from 'react';

const AddItem: React.FC = () => {
  return (
    <div>
      <h2>Add Item</h2>
      <form>
        <div>
          <label htmlFor="itemName">Item Name:</label>
          <input type="text" id="itemName" name="itemName" />
        </div>
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};

export default AddItem;