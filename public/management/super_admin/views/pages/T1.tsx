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
import UserLoginHistory from '../components/UserLoginHistory';

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

export interface Props { }

const T1: React.FC<Props> = () => {
    const [data, setData] = useState<{
        students: any[];
        parents: any[];
        teachers: any[];
        staff: any[];
        librarians: any[];
        accountants: any[];
        receptionists: any[];
    }>({
        students: [],
        parents: [],
        teachers: [],
        staff: [],
        librarians: [],
        accountants: [],
        receptionists: [],
    });

    const barChartRef = useRef<HTMLCanvasElement>(null);
    const pieChartRef = useRef<HTMLCanvasElement>(null);
    const doughnutChartRef = useRef<HTMLCanvasElement>(null); // New Doughnut Chart Ref
    const horizontalBarChartRef = useRef<HTMLCanvasElement>(null); // New Horizontal Bar Chart Ref
    const barChartInstance = useRef<Chart | null>(null);
    const pieChartInstance = useRef<Chart | null>(null);
    const doughnutChartInstance = useRef<Chart | null>(null); // New Doughnut Chart Instance
    const horizontalBarChartInstance = useRef<Chart | null>(null); // New Horizontal Bar Chart Instance

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const roles = [3, 6, 4, 5, 7, 8, 9];
                const roleKeys = [
                    'students',
                    'parents',
                    'teachers',
                    'staff',
                    'librarians',
                    'accountants',
                    'receptionists',
                ];

                const fetchPromises = roles.map((role) =>
                    axios.get(`/api/v1/auth/users-by-role?role_serial=${role}&orderByCol=id&orderByAsc=true&show_active_data=true`)
                );

                const responses = await Promise.all(fetchPromises);

                if (isMounted) {
                    const newData = responses.reduce((acc, response, index) => {
                        acc[roleKeys[index]] = response.data.data.data;
                        return acc;
                    }, {} as any);

                    setData(newData);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
            if (barChartInstance.current) barChartInstance.current.destroy();
            if (pieChartInstance.current) pieChartInstance.current.destroy();
            if (doughnutChartInstance.current) doughnutChartInstance.current.destroy(); // Destroy doughnut chart
            if (horizontalBarChartInstance.current) horizontalBarChartInstance.current.destroy(); // Destroy horizontal bar chart
        };
    }, []);

    useEffect(() => {
        if (barChartRef.current) {
            barChartInstance.current = new Chart(barChartRef.current, {
                type: 'bar',
                data: {
                    labels: [
                        'Students',
                        'Parents',
                        'Teachers',
                        'Staff',
                        'Librarians',
                        'Accountants',
                        'Receptionists',
                    ],
                    datasets: [
                        {
                            label: 'Total Count',
                            data: [
                                data.students.length,
                                data.parents.length,
                                data.teachers.length,
                                data.staff.length,
                                data.librarians.length,
                                data.accountants.length,
                                data.receptionists.length,
                            ],
                            backgroundColor: [
                                '#FF5733',
                                '#33FF57',
                                '#3357FF',
                                '#FF33A1',
                                '#A133FF',
                                '#FFC300',
                                '#DAF7A6',
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
                            text: 'User Statistics',
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                    animation: {
                        delay: (context) => {
                            let delay = 0;
                            if (context.type === 'data' && context.mode === 'default' && context.dataIndex !== undefined) {
                                delay = context.dataIndex * 300 + context.datasetIndex * 100;
                            }
                            return delay;
                        },
                        duration: 1000,
                        easing: 'easeOutQuart',
                    },
                },
            });
        }

        // Horizontal Bar Chart for User Counts
        if (horizontalBarChartRef.current) {
            horizontalBarChartInstance.current = new Chart(horizontalBarChartRef.current, {
                type: 'bar', // Use 'bar' type and set indexAxis to 'y' for horizontal
                data: {
                    labels: [
                        'Students',
                        'Parents',
                        'Teachers',
                        'Staff',
                        'Librarians',
                        'Accountants',
                        'Receptionists',
                    ],
                    datasets: [
                        {
                            label: 'Total Count',
                            data: [
                                data.students.length,
                                data.parents.length,
                                data.teachers.length,
                                data.staff.length,
                                data.librarians.length,
                                data.accountants.length,
                                data.receptionists.length,
                            ],
                            backgroundColor: [
                                '#FF5733',
                                '#33FF57',
                                '#3357FF',
                                '#FF33A1',
                                '#A133FF',
                                '#FFC300',
                                '#DAF7A6',
                            ],
                            borderColor: 'black',
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    indexAxis: 'y', // This makes the bar chart horizontal
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'User Counts (Active)',
                        },
                        legend: {
                            display: false, // Can hide legend if it's redundant
                        },
                    },
                    scales: {
                        x: { // Note: x and y are swapped for horizontal charts
                            beginAtZero: true,
                        },
                    },
                    animation: {
                        delay: (context) => {
                            let delay = 0;
                            if (context.type === 'data' && context.mode === 'default' && context.dataIndex !== undefined) {
                                delay = context.dataIndex * 300 + context.datasetIndex * 100;
                            }
                            return delay;
                        },
                        duration: 1000,
                        easing: 'easeOutQuart',
                    },
                },
            });
        }

        // Doughnut Chart for Student Gender Distribution
        if (doughnutChartRef.current && data.students.length > 0) {
            const genderCounts = data.students.reduce((acc, student) => {
                const gender = student.gender ? student.gender.toLowerCase() : 'other';
                if (gender === 'male') {
                    acc.male += 1;
                } else if (gender === 'female') {
                    acc.female += 1;
                } else {
                    acc.others += 1;
                }
                return acc;
            }, { male: 0, female: 0, others: 0 });

            doughnutChartInstance.current = new Chart(doughnutChartRef.current, {
                type: 'doughnut',
                data: {
                    labels: ['Male', 'Female', 'Others'],
                    datasets: [
                        {
                            data: [genderCounts.male, genderCounts.female, genderCounts.others],
                            backgroundColor: ['#006400', '#38b000', '#ccff33'], // Updated colors
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Student Gender Distribution',
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    let value = context.raw || 0;
                                    return `${label}${value}`;
                                },
                            },
                        },
                    },
                    animation: {
                        delay: (context) => {
                            let delay = 0;
                            if (context.type === 'data' && context.mode === 'default' && context.dataIndex !== undefined) {
                                // For pie/doughnut, dataIndex refers to the segment index
                                delay = context.dataIndex * 300;
                            }
                            return delay;
                        },
                        duration: 2000,
                        easing: 'easeOutQuart',
                    },
                },
            });
        }

        if (pieChartRef.current) {
            pieChartInstance.current = new Chart(pieChartRef.current, {
                type: 'pie',
                data: {
                    labels: ['Students', 'Parents', 'Teachers'],
                    datasets: [
                        {
                            data: [
                                data.students.length,
                                data.parents.length,
                                data.teachers.length,
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
                            text: 'Distribution of Students, Parents, and Teachers',
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    let value = context.raw || 0;
                                    return `${label}${value}`;
                                },
                            },
                        },
                    },
                    animation: {
                        delay: (context) => {
                            let delay = 0;
                            if (context.type === 'data' && context.mode === 'default' && context.dataIndex !== undefined) {
                                // For pie/doughnut, dataIndex refers to the segment index
                                delay = context.dataIndex * 300;
                            }
                            return delay;
                        },
                        duration: 2000,
                        easing: 'easeOutQuart',
                    },
                },
            });
        }

        return () => {
            if (barChartInstance.current) barChartInstance.current.destroy();
            if (pieChartInstance.current) pieChartInstance.current.destroy();
            if (doughnutChartInstance.current) doughnutChartInstance.current.destroy(); // Destroy doughnut chart
            if (horizontalBarChartInstance.current) horizontalBarChartInstance.current.destroy(); // Destroy horizontal bar chart
        };
    }, [data]);

    return (
        <div className="container">
            <div className="row my-4">
                {/* Card Item */}
                {[
                    { title: "Students", src: "/assets/dashboard/images/student.png", count: data.students?.length },
                    { title: "Parents", src: "/assets/dashboard/images/parent.png", count: data.parents?.length },
                    { title: "Teachers", src: "/assets/dashboard/images/teacher.png", count: data.teachers?.length },
                    { title: "Staff", src: "/assets/dashboard/images/staff.png", count: data.staff?.length },
                ].map((item, index) => (
                    <div className="col-xl-3 col-lg-4" key={index}>
                        <div className="card" data-intro={index === 0 ? "This is card" : undefined}>
                            <div className="business-top-widget card-body">
                                <div className="media d-inline-flex items-center gap-2">
                                    {/* Image */}
                                    <img
                                        width={50}
                                        height="auto"
                                        src={item.src}
                                        alt={item.title}
                                    />

                                    {/* Vertical Divider */}
                                    <div
                                        style={{
                                            height: '60px',
                                            width: '1px',
                                            backgroundColor: '#ccc',
                                            margin: '0 16px',
                                        }}
                                    />


                                    {/* Content */}
                                    <div className="media-body">
                                        <span className="mb-2">{item.title}</span>
                                        <h2 className="total-value m-0 counter">{item.count}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            <div className="row my-4">
                <div className="col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header">
                            <h3 className="m-0">User Statistics (Vertical Bar)</h3>
                        </div>
                        <div className="card-body">
                            <canvas ref={barChartRef}></canvas>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header">
                            <h3 className="m-0">User Counts (Horizontal Bar)</h3>
                        </div>
                        <div className="card-body">
                            <canvas ref={horizontalBarChartRef}></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row my-4">
                <div className="col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header">
                            <h3 className="m-0">Distribution of Students, Parents, and Teachers</h3>
                        </div>
                        <div className="card-body">
                            <canvas ref={pieChartRef}></canvas>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header">
                            <h3 className="m-0">Student Gender Distribution (Doughnut)</h3>
                        </div>
                        <div className="card-body">
                            <canvas ref={doughnutChartRef}></canvas>
                        </div>
                    </div>
                </div>
            </div>

            {/* New row for User Login History */}
            <div className="row my-4">
                <div className="col-md-12">
                    <UserLoginHistory />
                </div>
            </div>
        </div>
    );
};

export default T1;
