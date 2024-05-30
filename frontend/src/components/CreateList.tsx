import React from 'react';

const CreateList: React.FC = () => {
  return (
    <div>
      <h2>Create List</h2>
      <form>
        <div>
          <label htmlFor="listName">List Name:</label>
          <input type="text" id="listName" name="listName" />
        </div>
        <button type="submit">Create List</button>
      </form>
    </div>
  );
};

export default CreateList;
