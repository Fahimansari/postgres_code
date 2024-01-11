import airplane from "airplane";

export default airplane.task(
  {
    slug: "dummy_task",
    name: "Dummy task",
    envVars: {
      DB_NAME: {
        config: "DUMMY_DATA"
      }
    }
  },
  // This is your task's entrypoint. When your task is executed, this
  // function will be called.
  async () => {
    return process.env.DUMMY_DATA
  }
);
