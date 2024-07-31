import csv

def csv_to_sql(csv_file_path, table_name, output_file_path):
    # Read the CSV file
    with open(csv_file_path, mode='r', encoding='utf-8') as file:
        csv_reader = csv.DictReader(file, delimiter=";")
        
        # Prepare the SQL insert statement
        values_list = []
        for row in csv_reader:
            # Escape single quotes in the title, username, and the_category fields
            row['title'] = row['title'].replace("'", "''")
            row['username'] = row['username'].replace("'", "''")
            row['the_category'] = row['the_category'].replace("'", "''")
            # Escape single quotes and double quotes in the description field
            row['description'] = row['description'].replace("'", "''").replace('"', '""')
            values = (
                f"('{row['title']}', "
                f"'{row['username']}', "
                f"'{row['description']}', "
                f"'{row['the_category']}', "
                f"true)"
            )
            values_list.append(values)
        
        # Combine all VALUES clauses into a single SQL INSERT statement
        sql_query = f"INSERT INTO {table_name} (title, username, description, the_category, published) VALUES \n" + ",\n".join(values_list) + ";"
    
    # Write the SQL query to the output file
    with open(output_file_path, mode='w', encoding='utf-8') as file:
        file.write(sql_query)

# Example usage
csv_file_path = 'asd.csv'  # Replace with your CSV file path
output_file_path = 'asd.txt'  # Replace with your desired output file path
table_name = 'bots'
csv_to_sql(csv_file_path, table_name, output_file_path)

print(f"SQL query has been written to {output_file_path}")
