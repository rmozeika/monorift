# .bashrc

# Source global definitions
if [ -f /etc/bashrc ]; then
	. /etc/bashrc
fi

# User specific environment
PATH="$HOME/.local/bin:$HOME/bin:$PATH"
export PATH
export monorift=$HOME/monorift

alias 2m='cd $monorift'
alias 2md='cd $monorift/packages/devops'
alias 2mdd='cd $monorift/packages/devops/docker'
alias 2rp='cd $monorift/packages/rp2'
alias 2r='cd $monorift/packages/rift'

# Uncomment the following line if you don't like systemctl's auto-paging feature:
# export SYSTEMD_PAGER=

# User specific aliases and functions
