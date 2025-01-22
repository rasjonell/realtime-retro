---
date: 2025-01-22
tags: vim,ai,gpt
title: How To Use DeepSeek R1 In NeoVim
abstract: Running a local AI model (DeepSeek R1) in Neovim for enhanced code assistance.
---

## Using DeepSeek R1 In NeoVim

![AI](/ai.gif)

Sharing the steps I took to use DeepSeek R1 with Avante.nvim

#### 1. Download Ollama
You can download Ollama using the following command:
```bash
curl -fsSL https://ollama.com/install.sh | sh
```
Alternatively, you can download it from the official website for MacOS or Windows: 
[https://ollama.com/download](https://ollama.com/download).

#### 2. Pull the DeepSeek Model
Run the following command to pull the DeepSeek R1 model:
```bash
ollama pull deepseek-r1:14b
```
*Note:* I use the 14B model, which works very fast on my system (NVIDIA 4090 Super with 32GB RAM). Make sure 
you have sufficient RAM based on the model size:
- At least **8 GB** for 7B models
- At least **16 GB** for 13B models
- At least **32 GB** for 33B models

#### 3. Run Ollama on Startup
To ensure Ollama runs when your system starts, you need to run `ollama serve` on startup.
There are a couple of ways to achieve this:

##### 3.1 Using cron with `@reboot`
You can add a cron job to run `ollama serve` at boot using the `@reboot` special string.

- Open the crontab file:
  ```bash
  sudo crontab -e
  ```
- Add the following line to run `ollama serve` on reboot:
  ```
  @reboot /usr/bin/ollama serve
  ```
- Save and exit. On most systems, this will ensure `ollama serve` starts at boot. 

*NOTE:* You can achieve this also using `/etc/rc.local`, or by adding a init script to `/etc/init.d`,
or write a systemd service and enable it:

- Create a new service file in `/etc/systemd/system/ollama.service`:
  ```bash
  sudo vim /etc/systemd/system/ollama.service
  ```
- Add the following content to the file:
  ```ini
  [Unit]
  Description=Ollama AI Server
  After=network.target remote-fs.target syslog.target

  [Service]
  ExecStart=/usr/bin/ollama serve
  Restart=always
  User=root

  [Install]
  WantedBy=multi-user.target
  ```

- Enable and start the service:
  ```bash
  sudo systemctl enable ollama.service
  sudo systemctl start ollama.service
  ```

#### 4. Download Avante.nvim for LazyVim Users
Add the following plugin configuration to your Neovim config.
_(Follow [this link](https://github.com/yetone/avante.nvim?tab=readme-ov-file#installation) for more installation guides.)_

```lua
{
    "yetone/avante.nvim",
    lazy = false,
    version = false,
    event = "VeryLazy",
    opts = {
        provider = "ollama",
        auto_suggestions_provider = "ollama",

        vendors = {
            ollama = {
                api_key_name = "",
                model = "deepseek-r1:14b",
                __inherited_from = "openai",
                endpoint = "http://127.0.0.1:11434/v1",
            },
        },

        suggestion = {
            next = "<M-]>",
            prev = "<M-[>",
            accept = "<M-h>",
            dismiss = "<C-]>",
        },
    },
    build = "make",
    dependencies = {
        "hrsh7th/nvim-cmp",
        "MunifTanjim/nui.nvim",
        "nvim-lua/plenary.nvim",
        "stevearc/dressing.nvim",
        "zbirenbaum/copilot.lua",
        "nvim-tree/nvim-web-devicons",
        {
            'MeanderingProgrammer/render-markdown.nvim',
            opts = {
                file_types = { "markdown", "Avante" },
            },
            ft = { "markdown", "Avante" },
        },
        {
            "HakonHarnes/img-clip.nvim",
            event = "VeryLazy",
            opts = {
                default = {
                    use_absolute_path = true,
                    prompt_for_file_name = false,
                    embed_image_as_base64 = false,
                    drag_and_drop = {
                        insert_mode = true,
                    },
                },
            },
        },
    },
}
```
