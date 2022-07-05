module.exports = async (promise, searchString) => {
    try {
      await promise;
    } catch (error) {
      assert(
        error.message.search(searchString) >= 0,
        "Expected throw, got '" + error + "' instead",
      );
      return;
    }
    assert.fail('Expected throw not received');
  };