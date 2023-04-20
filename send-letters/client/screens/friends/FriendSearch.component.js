const handleChangeText = async (text) => {    
    const textToMatch = text.toLowerCase();
    const senderID = state.user._id;  
  
    // no need to connect to server if text contains restricted characters
    if (hasRestrictedChar(text) == true) {
      setMatchingUsers([]);
      return;
    }
  
    try {
      const resp = await axios.post(findIP()+"/api/matchUsers", { senderID, textToMatch, friends: true });
      
      if (!resp) {  // could not connect to backend
        console.log("ERROR: Could not establish server connection with axios");
        setSnackMessage("Could not establish connection to the server");
        setSnackIsVisible(true);
      } else if (resp.data.error) {  // backend error
        setSnackMessage(resp.data.error);
        setSnackIsVisible(true);
      } else if (!resp.data || !resp.data.matchingUsers) {
        console.error("Error: the response does not contain the expected fields");
      } else {
        setMatchingUsers(resp.data.matchingUsers);
      }
    } catch (err) {
      console.error(err);
    }
  };

export default handleChangeText;