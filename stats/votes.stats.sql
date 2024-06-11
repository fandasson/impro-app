-- unique users
SELECT DISTINCT av.user_id
FROM answers_vote av
JOIN questions q ON av.question_id = q.id
WHERE q.performance_id = 11;


WITH
performance AS (SELECT 11 AS performance_id), -- Set the performance_id here
player_votes AS (
    SELECT
        q.name AS question_name,
        av.player_id,
        q.index_order,
        COUNT(av.id) AS player_votes
    FROM
        questions q
        JOIN performance p ON q.performance_id = p.performance_id
        LEFT JOIN answers_vote av ON q.id = av.question_id
    WHERE
        q.performance_id = (SELECT performance_id FROM performance)
    GROUP BY
        q.name, av.player_id, q.index_order
),
distinct_players AS (
    SELECT DISTINCT player_id FROM answers_vote av
    JOIN questions q ON av.question_id = q.id
    -- JOIN performance p ON q.performance_id = p.performance_id
    WHERE q.performance_id = (SELECT performance_id FROM performance)
),
question_total_votes AS (
    SELECT
        q.name AS question_name,
        q.index_order,
        COUNT(av.id) AS total_votes
    FROM
        questions q
        LEFT JOIN answers_vote av ON q.id = av.question_id
    WHERE
        q.performance_id = (SELECT performance_id FROM performance)
    GROUP BY
        q.name, q.index_order
),
pivot_data AS (
    SELECT
        qt.question_name,
        qt.index_order,
        qt.total_votes AS number_of_votes,
        dp.player_id,
        COALESCE(pv.player_votes, 0) AS player_votes
    FROM
        question_total_votes qt
        LEFT JOIN player_votes pv ON qt.question_name = pv.question_name
        LEFT JOIN distinct_players dp ON dp.player_id = pv.player_id
)
SELECT
    question_name,
    number_of_votes,
    MAX(CASE WHEN player_id = 1 THEN player_votes ELSE 0 END) AS Lenka,
    MAX(CASE WHEN player_id = 2 THEN player_votes ELSE 0 END) AS Fanda,
    -- MAX(CASE WHEN player_id = 3 THEN player_votes ELSE 0 END) AS Maja,
    -- MAX(CASE WHEN player_id = 4 THEN player_votes ELSE 0 END) AS David,
    -- MAX(CASE WHEN player_id = 5 THEN player_votes ELSE 0 END) AS Peta,
    MAX(CASE WHEN player_id = 6 THEN player_votes ELSE 0 END) AS Styfa,
    MAX(CASE WHEN player_id = 9 THEN player_votes ELSE 0 END) AS Petra,
    MAX(CASE WHEN player_id = 11 THEN player_votes ELSE 0 END) AS Honza,
    -- MAX(CASE WHEN player_id = 12 THEN player_votes ELSE 0 END) AS Helenka,
    MAX(CASE WHEN player_id = 13 THEN player_votes ELSE 0 END) AS Marenka,
    MAX(CASE WHEN player_id = 14 THEN player_votes ELSE 0 END) AS Lukas,
    MAX(CASE WHEN player_id = 16 THEN player_votes ELSE 0 END) AS Michal,
    MAX(CASE WHEN player_id = 17 THEN player_votes ELSE 0 END) AS Radek,
    -- MAX(CASE WHEN player_id = 18 THEN player_votes ELSE 0 END) AS Vanda,
    MAX(CASE WHEN player_id = 19 THEN player_votes ELSE 0 END) AS Veronika,
    MAX(CASE WHEN player_id = 15 THEN player_votes ELSE 0 END) AS Lena

    -- Add more players as necessary
FROM
    pivot_data
GROUP BY
    question_name, index_order, number_of_votes
ORDER BY
    index_order;
