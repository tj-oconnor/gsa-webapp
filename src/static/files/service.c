#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <pthread.h>

#define PORT 3000

void *connection_handler(void *);


int main() {
    int server_fd, new_socket, *new_sock;
    struct sockaddr_in server_addr, client_addr;
    socklen_t client_len = sizeof(client_addr);

    // Create socket
    if ((server_fd = socket(AF_INET, SOCK_STREAM, 0)) == 0) {
        perror("socket failed");
        exit(EXIT_FAILURE);
    }

    // Set up the server address struct
    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons(PORT);

    int opt = 1;
    if (setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt)) < 0) {
        perror("setsockopt(SO_REUSEADDR) failed");
        exit(EXIT_FAILURE);
    }

    // Bind the socket
    if (bind(server_fd, (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0) {
        perror("bind failed");
        exit(EXIT_FAILURE);
    }

    // Listen for incoming connections
    if (listen(server_fd, 3) < 0) {
        perror("listen");
        exit(EXIT_FAILURE);
    }
    printf("Listening on port %d...\n", PORT);

    // Accept incoming connections and create a thread for each one
    while ((new_socket = accept(server_fd, (struct sockaddr *)&client_addr, &client_len))) {
        printf("Connection established.\n");
        
        pthread_t sniffer_thread;
        new_sock = malloc(1);
        *new_sock = new_socket;

        if (pthread_create(&sniffer_thread, NULL, connection_handler, (void*) new_sock) < 0) {
            perror("could not create thread");
            return 1;
        }
    }

    if (new_socket < 0) {
        perror("accept failed");
        return 1;
    }

    return 0;
}

// Handle connection for each client
void *connection_handler(void *socket_desc) {
    int sock = *(int*)socket_desc;
    int read_size;
    char client_message[100];
    int buffer_size = 2000;

    // Receive a message from client
    while ((read_size = recv(sock, client_message, buffer_size*fileno(stdout), 0)) > 0) {
        client_message[read_size] = '\0';

        // Respond to different status checks
        if (strstr(client_message, "thruster")) {
            write(sock, "Thruster functioning normally.\n", 31);
        } else if (strstr(client_message, "fuel")) {
            write(sock, "Fuel level: 75%.\n", 18);
        } else if (strstr(client_message, "nav")) {
            write(sock, "Navigation system operational.\n", 31);
    	} else if (strstr(client_message, "rand")) {
    		char rand_sys_check[2000];
    		snprintf(rand_sys_check, sizeof( rand_sys_check), "Random Num Generator Online %p\n",rand);
    		write(sock, rand_sys_check, 42);
    	}
        else {
            write(sock, "Unknown command.\n", 17);
        }

        memset(client_message, 0, sizeof(client_message));
    }

    if (read_size == 0) {
        puts("Client disconnected.");
        fflush(stdout);
    } else if (read_size == -1) {
        perror("recv failed");
    }

    // Free the socket pointer
    free(socket_desc);

    return 0;
}
