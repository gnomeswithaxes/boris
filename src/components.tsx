import React, { useEffect, useState } from "react";

export const Checkbox = (props: { checked: boolean, handleChange: any }) => {
    return (
        <label className="switch">
            <input id="auto" type="checkbox"
                checked={props.checked}
                onChange={props.handleChange} />
            <span className="slider round"></span>
        </label>
    );
};