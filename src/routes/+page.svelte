<script lang="ts">
  import Center from '$lib/components/center.svelte';
  import type Todo from '$lib/types/todo';
  import {
    Button,
    Checkbox,
    Heading,
    Input,
    Li,
    List,
    Spinner,
  } from 'flowbite-svelte';
  import { onMount } from 'svelte';
  import toast, { Toaster } from 'svelte-french-toast';
  import { flip } from 'svelte/animate';
  import { fly, slide } from 'svelte/transition';

  let newTodoTitle = '';
  // list of type Todo
  let todos: Todo[];

  onMount(async () => {
    todos = await getTodos();
  });

  async function getTodos() {
    const res = await fetch('/api/todo');

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  }

  async function addtodo(title: string) {
    if (!(String(title).length > 3)) {
      toast.error('Title is required and must be at least 3 characters long');
      return;
    }
    const req = await fetch('/api/todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
      }),
    })
      .then(async (fulfilled) => {
        if (!fulfilled) return;
        todos =
          todos.length == 0
            ? await getTodos()
            : [
                ...todos,
                {
                  id:
                    todos
                      .map((todo) => todo.id)
                      .reduce((a, b) => Math.max(a, b)) + 1,
                  full_text: title,
                  status: 0,
                },
              ];
        newTodoTitle = '';
      })
      .catch((e) => {
        toast.error('Something went wrong');
      });
  }

  async function deletetodo(id: number) {
    const req = await fetch('/api/todo', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((fulfilled) => {
        if (!fulfilled) return;
        todos = todos.filter((todo) => todo.id != id);
      })
      .catch((e) => {
        toast.error('Something went wrong');
      });
  }

  async function toggleDone(id: number, checked: boolean) {
    todos = todos.map((todo) => {
      if (todo.id == id) {
        todo.is_checked = checked;
      }
      return todo;
    });
    const req = await fetch('/api/todo', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        is_checked: checked,
      }),
    }).catch((e) => {
      todos = todos.map((todo) => {
        if (todo.id == id) {
          todo.is_checked = !checked;
        }
        return todo;
      });
    });
  }
</script>

<Toaster
  toastOptions={{
    duration: 2000,
  }}
/>

<main class="p-6 flex flex-col gap-3 min-h-screen items-center">
  <Heading customSize="text-4xl font-bold text-center ">Todos</Heading>
  <div class="flex-grow flex flex-col">
    {#if todos}
      {#if todos.length > 0}
        <List
          class="p-2 flex flex-col gap-2 w-96 flex-grow max-h-[calc(100vh-175px)] overflow-y-auto"
        >
          {#each todos as todo, i (todo.id)}
            <div
              in:fly|global={{ y: 25, duration: 200, delay: 50 + 50 * i }}
              out:slide={{ duration: 300 }}
              animate:flip
            >
              <Li class="flex items-center gap-3 justify-between">
                <Checkbox
                  bind:checked={todo.is_checked}
                  on:click={() => toggleDone(todo.id, !todo.is_checked)}
                  ><p class:line-through={todo.is_checked} class="text-xl">
                    {todo.full_text}
                  </p></Checkbox
                >
                <Button
                  size="sm"
                  on:click={() => deletetodo(todo.id)}
                  outline={true}
                  class="p-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    ><path
                      fill="currentColor"
                      d="m12 13.9l1.9 1.9q.3.275.713.275t.687-.275q.3-.3.3-.713t-.3-.687l-1.9-1.9l1.9-1.9q.3-.3.3-.713t-.3-.687q-.275-.3-.688-.3t-.712.3L12 11.1l-1.9-1.9q-.275-.3-.688-.3t-.712.3q-.275.275-.275.688t.275.712l1.9 1.9l-1.9 1.9q-.275.275-.275.688t.275.712q.3.275.713.275t.687-.275l1.9-1.9ZM7 21q-.825 0-1.413-.588T5 19V6q-.425 0-.713-.288T4 5q0-.425.288-.713T5 4h4q0-.425.288-.713T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5q0 .425-.288.713T19 6v13q0 .825-.588 1.413T17 21H7Z"
                    /></svg
                  >
                </Button>
              </Li>
            </div>
          {/each}
        </List>
      {:else}
        <Center>
          <div in:fly={{ y: 25 }}>Please add todos</div>
        </Center>
      {/if}
    {:else}
      <Center>
        <Spinner />
      </Center>>
    {/if}
  </div>
  <form class="w-full lg:max-w-sm self-center">
    <Input
      id="addtodo"
      placeholder="Todo title"
      size="lg"
      bind:value={newTodoTitle}
    >
      <svg
        slot="left"
        aria-hidden="true"
        class="w-6 h-6 text-gray-500 dark:text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        ><path
          fill="currentColor"
          d="M12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q1.625 0 3.075.475T17.75 3.8L16.3 5.275q-.95-.6-2.025-.938T12 4Q8.675 4 6.337 6.337T4 12q0 3.325 2.337 5.663T12 20q.8 0 1.55-.15t1.45-.425l1.5 1.525q-1.025.5-2.15.775T12 22Zm7-2v-3h-3v-2h3v-3h2v3h3v2h-3v3h-2Zm-8.4-3.4l-4.25-4.25l1.4-1.4l2.85 2.85l10-10.025l1.4 1.4L10.6 16.6Z"
        /></svg
      >

      <Button
        class="-mr-2"
        on:click={() => addtodo(newTodoTitle)}
        slot="right"
        size="sm"
        type="submit">Add todo!</Button
      >
    </Input>
  </form>
</main>

<style>
</style>
