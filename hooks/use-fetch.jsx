"use client";

import { useState } from "react";
import { toast } from "sonner";

const useFetch = (cb) => {
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(undefined);
    const [error, setError] = useState(undefined);

    const fn = async (...args) => {
        setLoading(true);
        setError(null);

        try {
            const response = await cb(...args);
            setData(response);
            setError(null);

        } catch (error) {
            setError(error);
            toast.error()
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, error, fn, setData };

};

export default useFetch;
