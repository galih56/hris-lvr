<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Laravel</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    </head>
    <body>
        <h1>Job Position / Organization Unit</h1>
        <form action="{{ route('job_positions.import') }}" method="POST" enctype="multipart/form-data">
            @csrf
            <input type="file" name="job_position_document" id="job_position_document"accept=".csv,.xlsx,.xls">
            <button type="submit">Submit</button>
        </form>
        <br>
        <h1>Employee Data</h1>
        <form action="{{ route('employees.import') }}" method="POST" enctype="multipart/form-data">
            @csrf
            <input type="file" name="employee_document" id="employee_document"accept=".csv,.xlsx,.xls">
            <button type="submit">Submit</button>
        </form>
    </body>
</html>
