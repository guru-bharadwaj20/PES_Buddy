#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#define MAX_ITEMS 100
#define MAX_ITEM_NAME 100
#define MAX_ORDERS 100

struct Order {
    char itemName[MAX_ITEM_NAME];
    char canteenName[50];
    int price;
};

struct Order allOrders[MAX_ORDERS];
int orderCount = 0;

void displayLocations();
float getDistance(char pickup[], char destination[]);
void calculateFare(float fare_per_km, float distance, char pickup[], char destination[]);
void PESDoormato();


void input_set(float a[][10], int week, int *n)
{
    do
    {
        printf("Enter the number of main categories in which you have spent money(max 4): ");
        scanf("%d", n);
        if (*n > 4 || *n <= 0)
            printf("Enter a valid number of categories!\n");
    } while (*n > 4 || *n <= 0);

    for (int i = 0; i < week; i++)
    {
        printf("\nEnter expenses for Week %d:\n", i + 1);
        for (int j = 0; j < *n; j++)
        {
            printf("Category %d: ", j + 1);
            scanf("%f", &a[i][j]);
        }
    }
}


void calculate_sums(float a[][10], int week, int n, float weekly_limit)
{
    float category_sum[10] = {0};
    float weekly_sum[week];
    float percentage_exceeded;
    for (int i = 0; i < week; i++)
    {
        weekly_sum[i] = 0;
        for (int j = 0; j < n; j++)
        {
            weekly_sum[i] += a[i][j];
            category_sum[j] += a[i][j];
        }
    }
    printf("\n---- Weekly Expense Summary ----\n");
    for (int i = 0; i < week; i++)
    {
        printf("Total Expense for Week %d: %.2f\n", i + 1, weekly_sum[i]);
        if (weekly_sum[i] > (weekly_limit * 1.003))
        {
            percentage_exceeded = ((weekly_sum[i] - weekly_limit) / weekly_limit) * 100;
            printf("Warning! You have exceeded your weekly limit by %.2f%%\n", percentage_exceeded);
        }
    }
    printf("\n---- Category-wise Expense Summary ----\n");
    for (int j = 0; j < n; j++)
    {
        printf("Total spent in Category %d: %.2f\n", j + 1, category_sum[j]);
    }
}

void displayAvailableScooters(int scooter_ids[], char drivers[][50], int availability[], float fares[], int size) {
    printf("\nAvailable Scooters:\n");
    int found = 0;
    for (int i = 0; i < size; i++) {
        if (availability[i] == 1) {
            printf("Scooter ID: %d, Driver: %s, Fare: %.2f per km\n", scooter_ids[i], drivers[i], fares[i]);
            found = 1;
        }
    }
    if (!found) 
        printf("No scooters available at the moment.\n");
}

void bookScooters(int scooter_ids[], char drivers[][50], int availability[], float fares[], int size) {
    int scooter_id, location_choice;
    char pickup[50], destination[50];

    displayLocations();

    printf("\nEnter your choice for Pickup and Destination:\n");
    printf("Enter the number corresponding to the Pickup and Destination (e.g., 1 for GJBC <-> OAT): ");
    scanf("%d", &location_choice);
    getchar();

    switch(location_choice) {
        case 1:
            strcpy(pickup, "GJBC");
            strcpy(destination, "OAT");
            break;
        case 2:
            strcpy(pickup, "SKM");
            strcpy(destination, "BE BLOCK");
            break;
        case 3:
            strcpy(pickup, "MRD BLOCK");
            strcpy(destination, "F BLOCK");
            break;
        default:
            printf("Invalid choice!\n");
            return;
    }

    float distance = getDistance(pickup, destination);

    if (distance == -1) {
        printf("Invalid pickup or destination location.\n");
        return;
    }

    displayAvailableScooters(scooter_ids, drivers, availability, fares, size);
    printf("\nEnter Scooter ID to book: ");
    scanf("%d", &scooter_id);
    getchar();

    int scooter_found = 0;
    for (int i = 0; i < size; i++) {
        if (scooter_ids[i] == scooter_id) {
            if (availability[i] == 1) {
                availability[i] = 0;
                printf("Scooter %d booked successfully!\n", scooter_id);
                calculateFare(fares[i], distance, pickup, destination);
                scooter_found = 1;
                break;
            } else {
                printf("Scooter %d is already booked.\n", scooter_id);
                scooter_found = 1;
                break;
            }
        }
    }

    if (!scooter_found) {
        printf("Invalid Scooter ID. Please try again.\n");
    }
}

void calculateFare(float fare_per_km, float distance, char pickup[], char destination[]) {
    float total_fare = fare_per_km * distance;
    printf("\nBooking Details:\n");
    printf("Pickup Location: %s\n", pickup);
    printf("Destination: %s\n", destination);
    printf("Distance: %.2f km\n", distance);
    printf("Total Fare: %.2f\n", total_fare);
}

float getDistance(char pickup[], char destination[]) {
    if ((strcmp(pickup, "GJBC") == 0 && strcmp(destination, "OAT") == 0) ||
        (strcmp(pickup, "OAT") == 0 && strcmp(destination, "GJBC") == 0)) {
        return 2.0;
    } else if ((strcmp(pickup, "SKM") == 0 && strcmp(destination, "BE BLOCK") == 0) ||
               (strcmp(pickup, "BE BLOCK") == 0 && strcmp(destination, "SKM") == 0)) {
        return 3.0;
    } else if ((strcmp(pickup, "MRD BLOCK") == 0 && strcmp(destination, "F BLOCK") == 0) ||
               (strcmp(pickup, "F BLOCK") == 0 && strcmp(destination, "MRD BLOCK") == 0)) {
        return 2.0;
    } else {
        return -1;
    }
}

void displayLocations() {
    printf("\nAvailable Pickup and Destination Locations:\n");
    printf("1. GJBC  <-> OAT\n");
    printf("2. SKM   <-> BE BLOCK\n");
    printf("3. MRD BLOCK <-> F BLOCK\n");
}

void choice()
{
    int c, week, n;
    float weekly_limit;
    while (1)
    {
        printf("\n---- Main Menu ----\n");
        printf("1. Expense Tracker\n");
        printf("2. PES Scootigo\n");
        printf("3. PES Doormato\n");
        printf("4. Exit");
        printf("\nYour Choice: ");
        scanf("%d", &c);
        switch (c)
        {
            int go_back;
            case 1:
            {
                printf("Enter the number of weeks for which you have tracked your expenses: ");
                scanf("%d", &week);
                printf("\nChoose the categories from:\n");
                printf("Category 1: Food\t\tCategory 2: Travel\n");
                printf("Category 3: Study materials\tCategory 4: Miscellaneous\n");
                
                printf("Enter your weekly spending limit: ");
                scanf("%f", &weekly_limit);

                float exp[week][10];
                input_set(exp, week, &n);
                calculate_sums(exp, week, n, weekly_limit);

                printf("\nEnter 0 to go to the Main Menu or any Other Key to Exit: ");
                scanf("%d", &go_back);
                if (go_back == 0) 
                    continue;
                else 
                {
                    printf("Thank You!\n");
                    exit(0);
                }
            }
case 2:
{
    printf("\nWelcome to PES Scootigo!\n");
    int scooter_ids[5] = {101, 102, 103, 104, 105};
    char drivers[5][50] = {"Rahul", "Kishan", "Raj", "Deepak", "Ravi"};
    int availability[5] = {1, 1, 1, 1, 1};
    float fares[5] = {10.0, 12.5, 9.8, 9.0, 15.0};

    int size = 5, choice2;

    while (1) {
        printf("\n=== Scooter Booking System ===\n");
        printf("1. Display Available Scooters\n");
        printf("2. Book a Scooter\n");
        printf("3. Exit\n");
        printf("Enter your choice: ");
        scanf("%d", &choice2);
        getchar();

        switch (choice2) {
            case 1:
                displayAvailableScooters(scooter_ids, drivers, availability, fares, size);
                break;
            case 2:
                bookScooters(scooter_ids, drivers, availability, fares, size);
                break;
            case 3:
                printf("Exiting to Main Menu...\n");
                goto scootigo_done;
            default:
                printf("Invalid choice! Please try again.\n");
        }
    }

scootigo_done:
    break;
}

            case 3:
            {
                printf("\nWelcome to PES Doormato!\n");
                printf("Redirecting!!\n");
                PESDoormato();

                printf("\nEnter 0 to go to the main menu or any other key to exit: ");
                scanf("%d", &go_back);
                if (go_back == 0) 
                    continue;
                else 
                {
                    printf("Thank You!\n");
                    exit(0);
                }
            }
            
            case 4:
            {
                printf("\nThank You!\n");
                exit(0);
            }

            default:
                printf("\nKindly enter a valid choice!\n");
        }
    }
}

void PESDoormato()
{
    int canteen_choice, menu_choice, item_choice;
    char *canteen_name = NULL;
    char menu_filename[50];
    char item_names[MAX_ITEMS][MAX_ITEM_NAME];
    int item_prices[MAX_ITEMS];
    int item_count;
    int total_cost = 0;

    orderCount = 0;
    total_cost = 0;
    for (int i = 0; i < sizeof(allOrders); i++) {
    ((char*)allOrders)[i] = 0;
}

    while (1)
    {
        printf("\nSelect a Canteen!\n");
        printf("1: SKM Canteen\t\t\t2: GJBC Canteen\n");
        printf("3: BE BLOC 13th Floor Canteen\t4: HornBill Canteen\n");
        printf("Enter your choice (0 to finish ordering): ");
        scanf("%d", &canteen_choice);

        if (canteen_choice == 0)
            break;

        switch (canteen_choice)
        {
        case 1:
            canteen_name = "SKM Canteen";
            strcpy(menu_filename, "skm_menu.txt");
            break;
        case 2:
            canteen_name = "GJBC Canteen";
            strcpy(menu_filename, "gjbc_menu.txt");
            break;
        case 3:
            canteen_name = "BE BLOC 13th Floor Canteen";
            strcpy(menu_filename, "bebloc_menu.txt");
            break;
        case 4:
            canteen_name = "HornBill Canteen";
            strcpy(menu_filename, "hornbill_menu.txt");
            break;
        default:
            printf("Enter a Valid choice!\n");
            continue;
        }

        printf("\nWelcome to %s!\n", canteen_name);

        while (1)
        {
            printf("Enter 1 to view Menu, 0 to go back: ");
            scanf("%d", &menu_choice);

            if (menu_choice == 0)
                break;
            else if (menu_choice == 1)
                break;
            else
                printf("Invalid Input!\n");
        }

        if (menu_choice == 0)
            continue;

        FILE *fp = fopen(menu_filename, "r");
        if (fp == NULL)
        {
            printf("Sorry, the menu for %s is currently unavailable.\n", canteen_name);
            continue;
        }

        item_count = 0;
        char line[150];
        while (fgets(line, sizeof(line), fp) != NULL)
        {
            char *price_str = strrchr(line, ' ');
            if (price_str != NULL)
            {
                *price_str = '\0';
                price_str++;
                item_prices[item_count] = atoi(price_str);
                strcpy(item_names[item_count], line);
                size_t len = strlen(item_names[item_count]);
                if (item_names[item_count][len - 1] == '\n')
                    item_names[item_count][len - 1] = '\0';
                item_count++;
                if (item_count >= MAX_ITEMS)
                    break;
            }
        }
        fclose(fp);

        printf("\nMenu for %s:\n", canteen_name);
        for (int i = 0; i < item_count; i++)
        {
            printf("%d. %s - Rs. %d\n", i + 1, item_names[i], item_prices[i]);
        }

        printf("Enter your item number (0 to cancel): ");
        scanf("%d", &item_choice);

        if (item_choice >= 1 && item_choice <= item_count)
        {
            if (orderCount < MAX_ORDERS)
            {
                struct Order o;
                strcpy(o.itemName, item_names[item_choice - 1]);
                strcpy(o.canteenName, canteen_name);
                o.price = item_prices[item_choice - 1];
                allOrders[orderCount++] = o;
                total_cost += o.price;
                printf("Added '%s' from %s to your order.\n", o.itemName, o.canteenName);
            }
            else
            {
                printf("Maximum order limit reached!\n");
            }
        }
        else if (item_choice == 0)
        {
            continue;
        }
        else
        {
            printf("Invalid item number.\n");
        }
    }

    printf("\n---- Your Order Summary ----\n");
    for (int i = 0; i < orderCount; i++)
    {
        printf("Item %d: '%s', from '%s' - Rs. %d\n", i + 1, allOrders[i].itemName, allOrders[i].canteenName, allOrders[i].price);
    }
    printf("\nTotal Cost: Rs. %d\n", total_cost);

    printf("\nEnter 0 to go to the main menu or any other key to exit: ");
    int main_menu_choice;
    scanf("%d", &main_menu_choice);
    if (main_menu_choice != 0)
    {
        printf("Thank You!\n");
        exit(0);
    }
    else
        choice();
}

void register_new_user() 
{
    char name[50], SRN[14];
    int i;
    FILE *file;
    printf("Enter your Name: ");
    i = 0;
    while(1) 
    {
        name[i] = getchar();
        if (name[i] == '\n' || name[i] == '\0') 
        {
            name[i] = '\0';
            break;
        }
        i++;
    }
    while(1) 
    {
        printf("Enter your SRN: ");
        i = 0;
        while(1) 
        {
            SRN[i] = getchar();
            if (SRN[i] == '\n' || SRN[i] == '\0') 
            {
                SRN[i] = '\0';
                break;
            }
            i++;
        }
        int length = 0;
        while (SRN[length] != '\0') 
            length++;
        if (length == 13) 
            break; 
        else 
            printf("Invalid SRN Format! It should be exactly 13 Characters long.\n");
    }
    file = fopen("users.txt", "r");
    if (file != NULL) 
    {
        char file_name[50], file_srn[14];
        int exists = 0;
        while (fscanf(file, "%49[^,], %13[^\n]\n", file_name, file_srn) != EOF) 
        {
            if (strcmp(file_srn, SRN) == 0) 
            {
                exists = 1;
                break;
            }
        }
        fclose(file);
        if (exists) 
        {
            printf("User Already Exists!\n\n");
            return;
        }
    }
    file = fopen("users.txt", "a");
    if (file != NULL) 
    {
        fprintf(file, "%s, %s\n", name, SRN);
        fclose(file);
    }
    printf("Remember, your SRN is your Password!\n");
    printf("Redirecting you to the login page...\n\n");
}

int user_exists(const char *SRN) 
{
    FILE *file = fopen("users.txt", "r");
    if (file == NULL)
        return 0;

    char file_name[50], file_srn[14];
    while (fscanf(file, "%49[^,], %13[^\n]\n", file_name, file_srn) != EOF) 
    {
        if (strcmp(file_srn, SRN) == 0) 
        {
            fclose(file);
            return 1;
        }
    }
    fclose(file);
    return 0;
}

int main() 
{
    char name[50], SRN[14], entered_password[14];
    int i;
    int user_choice;
    int login_attempts;

    printf("Hey buddy, Welcome to PES BUDDY!\n");

    while(1) 
    {
        printf("1. Register\n2. Login\nEnter your choice: ");
        if (scanf("%d", &user_choice) != 1) {
            while (getchar() != '\n'); 
            printf("Invalid input. Please enter 1 or 2.\n\n");
            continue;
        }
        getchar();

        if (user_choice == 2) 
        {
            login_attempts = 3;
            while (login_attempts--) 
            {
                printf("Name: ");
                i = 0;
                while(1) 
                {
                    name[i] = getchar();
                    if (name[i] == '\n' || name[i] == '\0') 
                    {
                        name[i] = '\0';
                        break;
                    }
                    i++;
                }

                printf("Password: ");
                i = 0;
                while(1) 
                {
                    entered_password[i] = getchar();
                    if (entered_password[i] == '\n' || entered_password[i] == '\0') 
                    {
                        entered_password[i] = '\0';
                        break;
                    }
                    i++;
                }

                if (user_exists(entered_password)) 
                {
                    printf("\nWelcome back, %s!\n", name);
                    choice();
                    return 0;
                } 
                else 
                {
                    printf("Invalid Credentials!\nLogin Attempts left: %d\n\n", login_attempts);
                }
            }
            printf("Too many failed Attempts!\nTry again after some time!\nThank You!\n");
            return 0;
        } 
        else if (user_choice == 1) 
        {
            register_new_user();
        } 
        else 
        {
            printf("Invalid choice!\nPlease enter 1 to Register or 2 to Login.\n\n");
        }
    }

    return 0;
}
