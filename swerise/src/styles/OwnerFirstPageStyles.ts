import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    addButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        paddingVertical: 10,
        marginBottom: 15,
        alignItems: 'center',
      },
      addButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
      },

    closeButton: {
      marginTop: 20,
      backgroundColor: '#4CAF50',
      paddingVertical: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    closeButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    deleteButton: {
        color: '#ff0000',
        marginLeft: 10,
      },
    exitButton: {
      marginTop: 40,
      backgroundColor: 'red',
      paddingVertical: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    exitButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
      },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    navbar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: 'white',
    },
    navButton: {
      padding: 10,
    },
    navText: {
      color: 'black',
      fontSize: 16,
    },
    appName: {
      color: 'black',
      fontSize: 20,
      fontWeight: 'bold',
    },
    body: {
      flex: 1,
      justifyContent: 'flex-start',
      padding: 20,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 40,
    },
    shopItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
    shopItemText: {
      fontSize: 18,
      color: '#333',
    },
    square: {
      flex: 1,
      margin: 10,
      height: 80,
      backgroundColor: '#4CAF50',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      elevation: 3,
    },
    squareText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });