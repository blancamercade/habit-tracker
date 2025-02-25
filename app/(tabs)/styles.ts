import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  habitItem: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    flexDirection: "row",  // Align items horizontally
    justifyContent: "space-between", // Push items to the edges
    alignItems: "center", // Align vertically in the center
  },
  habitCompleted: {
    backgroundColor: '#c8e6c9',
  },
  habitText: {
    fontSize: 18,
  },
  habitTextCompleted: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  GreenButton: {
    backgroundColor: "#1B5E20",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 5,
  },
  GreenButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  RedButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  RedButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  goalItem: {
    marginVertical: 10,
    padding: 10,
  },
  progressBar: {
    height: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  noHistory: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    padding: 15,
  },
  historyItem: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  date: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  habit: {
    fontSize: 14,
    color: 'gray',
  },
  deleteText: {
    fontSize: 18,
    color: "red",
  },
});

export default styles;
