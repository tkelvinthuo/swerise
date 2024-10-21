import { StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    appname: {
        color: 'black',
        fontSize: 19,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        backgroundColor: 'white',
    },
    navbutton: {
        padding: 10,
    },
    navtext: {
        color: 'black',
        fontSize: 16,
    },
    body: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        flex: 1,
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        marginHorizontal: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: '#f44336',
        paddingVertical: 15,
        marginHorizontal: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Modal Styles
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
        marginBottom: 20,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    salesListContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    salesListTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    saleItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    saleText: {
        fontSize: 16,
    },
});

export const modalStyles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: 'white',
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    saleItem: {
      backgroundColor: '#f8f8f8',
      padding: 10,
      marginVertical: 5,
      borderRadius: 5,
      width: '100%',
    },
    saleText: {
      fontSize: 16,
    },
    emptyText: {
      fontSize: 16,
      color: '#888',
      textAlign: 'center',
      marginTop: 20,
    },
    closeButton: {
        backgroundColor: '#4CAF50', // Tomato color or any color you prefer
        padding: 10,
        borderRadius: 5,
        alignItems: 'center', // Center the text horizontally
        marginTop: 10, // Add some space at the top if needed
      },
      closeButtonText: {
        color: '#FFFFFF', // Text color
        fontSize: 16,
        fontWeight: 'bold',
      },
  });