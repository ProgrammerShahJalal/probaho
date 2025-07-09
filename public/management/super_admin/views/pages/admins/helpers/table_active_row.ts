function active_row(toggle_icon, e) {
    if (toggle_icon.current) {
        let parent = toggle_icon.current.parentNode as HTMLElement | null;
        if (parent && parent.parentNode) {
            parent = parent.parentNode as HTMLElement;
        }

        const table_rows =
            document.querySelectorAll<HTMLElement>('.table_rows');
        if (table_rows.length) {
            [...table_rows].forEach((i) => {
                if (i !== parent) i.classList.remove('active');
            });
        }

        if (parent) {
            parent.classList.toggle('active');
        }
    }
}

export default active_row;
