import * as chalk from "chalk";
import app from "./app";

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(chalk.bgGreen(chalk.black(`Server running on port ${PORT}`)));
});
