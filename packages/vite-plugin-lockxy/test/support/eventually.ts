export const eventually = async <T>(
    read: () => Promise<T>,
    accept: (value: T) => boolean | Promise<boolean>
): Promise<T> => {
    const deadline = Date.now() + 5_000;
    let value = await read();

    while (!(await accept(value)) && Date.now() < deadline) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        value = await read();
    }

    return value;
};
