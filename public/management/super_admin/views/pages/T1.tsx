import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import {
    Chart,
    BarController,
    BarElement,
    PointElement,
    ArcElement,
    PieController,
    LinearScale,
    Tooltip,
    Legend,
    Title,
    CategoryScale,
} from 'chart.js';

Chart.register(
    BarController,
    BarElement,
    PointElement,
    ArcElement,
    PieController,
    LinearScale,
    Title,
    CategoryScale,
    Tooltip,
    Legend,
);

export interface Props {}

const T1: React.FC<Props> = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [parents, setParents] = useState<any[]>([]);
    const [admins, setAdmins] = useState<any[]>([]);
    const [blogs, setBlogs] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);

    const barChartRef = useRef<HTMLCanvasElement>(null);
    const pieChartRef = useRef<HTMLCanvasElement>(null);
    const barChartInstance = useRef<Chart | null>(null);
    const pieChartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        axios
            .get(
                `/api/v1/auth?orderByCol=id&orderByAsc=true&show_active_data=true&paginate=10`,
            )
            .then((res) => {
                const users = res.data.data.data;
                console.log('UI roles', users);
                setAdmins(
                    users.filter((item: any) => item.role?.title === 'admin'),
                );
                setParents(
                    users.filter((item: any) => item.role?.title === 'parent'),
                );
                setStudents(
                    users.filter((item: any) => item.role?.title === 'student'),
                );
            });
    }, []);

    useEffect(() => {
        axios
            .get(
                `/api/v1/blogs?orderByCol=id&orderByAsc=true&show_active_data=true&paginate=10`,
            )
            .then((res) => setBlogs(res.data.data.data));
    }, []);

    useEffect(() => {
        axios
            .get(
                `/api/v1/events?orderByCol=id&orderByAsc=true&show_active_data=true&paginate=10`,
            )
            .then((res) => setEvents(res.data.data.data));
    }, []);

    useEffect(() => {
        // Destroy previous charts if they exist
        if (barChartInstance.current) barChartInstance.current.destroy();
        if (pieChartInstance.current) pieChartInstance.current.destroy();

        // Bar Chart
        if (barChartRef.current) {
            barChartInstance.current = new Chart(barChartRef.current, {
                type: 'bar',
                data: {
                    labels: [
                        'Students',
                        'Parents',
                        'Admins',
                        'Blogs',
                        'Events',
                    ],
                    datasets: [
                        {
                            label: 'Total Count',
                            data: [
                                students.length,
                                parents.length,
                                admins.length,
                                blogs.length,
                                events.length,
                            ],
                            backgroundColor: [
                                '#FF5733',
                                '#33FF57',
                                '#3357FF',
                                '#FF33A1',
                                '#A133FF',
                            ],
                            borderColor: 'black',
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'User and Content Statistics',
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        }

        // Pie Chart
        if (pieChartRef.current) {
            pieChartInstance.current = new Chart(pieChartRef.current, {
                type: 'pie',
                data: {
                    labels: ['Students', 'Blogs', 'Events'],
                    datasets: [
                        {
                            data: [
                                students.length,
                                blogs.length,
                                events.length,
                            ],
                            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Distribution of Students, Blogs, and Events',
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    let label = 'Total Count';
                                    let value = context.raw || 0;
                                    return `${label}: ${value}`;
                                },
                            },
                        },
                    },
                },
            });
        }
    }, [students, parents, admins, blogs, events]);

    return (
        <div className="container">
            <div className="row my-4">
                <div className="col-xl-3 col-lg-4">
                    <div className="card" data-intro="This is card">
                        <div className="business-top-widget card-body">
                            <div className="media d-inline-flex">
                                <div className="media-body">
                                    <span className="mb-2">Students</span>
                                    <h2 className="total-value m-0 counter">
                                        {students?.length}
                                    </h2>
                                </div>
                                <img
                                    width={100}
                                    height={'auto'}
                                    src="/assets/dashboard/images/student.png"
                                    alt="Students"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-lg-4">
                    <div className="card">
                        <div className="business-top-widget card-body">
                            <div className="media d-inline-flex">
                                <div className="media-body">
                                    <span className="mb-2">Parents</span>
                                    <h2 className="total-value m-0 counter">
                                        {parents?.length}
                                    </h2>
                                </div>
                                <img
                                    width={100}
                                    height={'auto'}
                                    src="/assets/dashboard/images/parent.png"
                                    alt="Parents"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-lg-4">
                    <div className="card">
                        <div className="business-top-widget card-body">
                            <div className="media d-inline-flex">
                                <div className="media-body">
                                    <span className="mb-2">Events</span>
                                    <h2 className="total-value m-0 counter">
                                        {events?.length}
                                    </h2>
                                </div>
                                <img
                                    width={100}
                                    height={'auto'}
                                    src="/assets/dashboard/images/event-list.png"
                                    alt="Events"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-lg-4">
                    <div className="card">
                        <div className="business-top-widget card-body">
                            <div className="media d-inline-flex">
                                <div className="media-body">
                                    <span className="mb-2">Blogs</span>
                                    <h2 className="total-value m-0 counter">
                                        {blogs?.length}
                                    </h2>
                                </div>
                                <img
                                    width={100}
                                    height={'auto'}
                                    src="/assets/dashboard/images/blog.png"
                                    alt="Blogs"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row my-4">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h3>User and Content Statistics</h3>
                            <canvas ref={barChartRef}></canvas>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header py-1">
                            <h3 className="m-0">
                                Distrubution of Students, Events and Blogs
                            </h3>
                        </div>
                        <div className="card-body">
                            <canvas ref={pieChartRef}></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default T1;
