// handler.js

module.exports.handler = async (event, context) => {
  try {
    // Your existing handler logic here

    // Call and execute the logic from index.js
    const indexLogic = require('./index.js');
    const result = await indexLogic();

    // Your processing logic
    console.log("in try block")

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success', result }),
    };
  } catch (error) {
    console.error('Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};


