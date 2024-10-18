import application from "@/application/app";

const PORT = process.env.PORT || 3000;

application.app.listen(PORT, () => console.log(`running at port ${PORT}`));
