/**
 * Minecraft Bot for Version 26.3 (Protocol 777) on Cracked / Offline Servers
 * Host: np.cavepvp.com
 * Username: LebronNoGames
 */

// --- 26.3 Protocol Compatibility Layer ---
const mcData = require('minecraft-data')
const data = require('minecraft-data/data.js')

// Clone protocol definitions from 26.1 and adapt for 26.3 changes
const proto = JSON.parse(JSON.stringify(data.pc['26.1'].protocol))

// 1. Account for 16-byte session UUID appended in 26.3 Login Success packet
proto.login.toClient.types.packet_success[1].push({
  name: 'session_id',
  type: 'UUID'
})

// 2. Adjust Configuration packet IDs that shifted in Minecraft 26.3
const configMappings = {
  '0x00': 'cookie_request',
  '0x01': 'custom_payload',
  '0x02': 'disconnect',
  '0x03': 'finish_configuration',
  '0x04': 'keep_alive',
  '0x05': 'ping',
  '0x06': 'reset_chat',
  '0x07': 'registry_data',
  '0x08': 'remove_resource_pack',
  '0x09': 'add_resource_pack',
  '0x0a': 'post_effects',
  '0x0b': 'store_cookie',
  '0x0c': 'transfer',
  '0x0d': 'feature_flags',
  '0x0e': 'tags',
  '0x0f': 'select_known_packs',
  '0x10': 'custom_report_details',
  '0x11': 'server_links',
  '0x12': 'clear_dialog',
  '0x13': 'show_dialog',
  '0x14': 'code_of_conduct'
}
proto.configuration.toClient.types.packet[1][0].type[1].mappings = configMappings
proto.configuration.toClient.types.packet_post_effects = ['container', []]

// 3. Adjust Play toClient packet IDs and mappings for Minecraft 26.3
const playToClientList = [
  'bundle_delimiter',
  'spawn_entity',
  'animation',
  'statistics',
  'acknowledge_player_digging',
  'block_break_animation',
  'tile_entity_data',
  'block_action',
  'block_change',
  'boss_bar',
  'difficulty',
  'chunk_batch_finished',
  'chunk_batch_start',
  'chunk_biomes',
  'clear_titles',
  'tab_complete',
  'declare_commands',
  'close_window',
  'window_items',
  'craft_progress_bar',
  'set_slot',
  'cookie_request',
  'set_cooldown',
  'custom_chat_completions',
  'custom_payload',
  'damage_event',
  'debug_block_value',
  'debug_chunk_value',
  'debug_entity_value',
  'debug_event',
  'debug_sample',
  'delete_chat',
  'kick_disconnect',
  'disguised_chat',
  'entity_status',
  'sync_entity_position',
  'explosion',
  'add_transient_block',
  'unload_chunk',
  'game_state_change',
  'game_rule_values',
  'game_test_highlight_pos',
  'open_horse_window',
  'hurt_animation',
  'initialize_world_border',
  'keep_alive',
  'map_chunk',
  'world_event',
  'world_particles',
  'update_light',
  'login',
  'low_disk_space_warning',
  'map',
  'trade_list',
  'rel_entity_move',
  'entity_move_look',
  'move_minecart',
  'entity_look',
  'vehicle_move',
  'open_book',
  'open_window',
  'open_sign_entity',
  'ping',
  'ping_response',
  'craft_recipe_response',
  'abilities',
  'player_chat',
  'end_combat_event',
  'enter_combat_event',
  'death_combat_event',
  'player_remove',
  'player_info',
  'face_player',
  'position',
  'player_rotation',
  'recipe_book_add',
  'recipe_book_remove',
  'recipe_book_settings',
  'entity_destroy',
  'remove_entity_effect',
  'reset_score',
  'remove_resource_pack',
  'add_resource_pack',
  'post_effects',
  'respawn',
  'entity_head_rotation',
  'multi_block_change',
  'select_advancement_tab',
  'server_data',
  'action_bar',
  'world_border_center',
  'world_border_lerp_size',
  'world_border_size',
  'world_border_warning_delay',
  'world_border_warning_reach',
  'camera',
  'update_view_position',
  'update_view_distance',
  'set_cursor_item',
  'spawn_position',
  'scoreboard_display_objective',
  'entity_metadata',
  'attach_entity',
  'entity_velocity',
  'entity_equipment',
  'experience',
  'update_health',
  'held_item_slot',
  'scoreboard_objective',
  'set_passengers',
  'set_player_inventory',
  'teams',
  'scoreboard_score',
  'simulation_distance',
  'set_title_subtitle',
  'update_time',
  'set_title_text',
  'set_title_time',
  'entity_sound_effect',
  'sound_effect',
  'start_configuration',
  'stop_sound',
  'store_cookie',
  'swing_animation',
  'system_chat',
  'playerlist_header',
  'nbt_query_response',
  'collect',
  'entity_teleport',
  'test_instance_block_status',
  'set_ticking_state',
  'step_tick',
  'transfer',
  'advancements',
  'entity_update_attributes',
  'entity_effect',
  'declare_recipes',
  'tags',
  'set_projectile_power',
  'custom_report_details',
  'server_links',
  'tracked_waypoint',
  'clear_dialog',
  'show_dialog'
]

const playToClientMappings = {}
for (let i = 0; i < playToClientList.length; i++) {
  playToClientMappings['0x' + i.toString(16).padStart(2, '0')] = playToClientList[i]
}
proto.play.toClient.types.packet[1][0].type[1].mappings = playToClientMappings
proto.play.toClient.types.packet_add_transient_block = ['container', []]
proto.play.toClient.types.packet_post_effects = ['container', []]
proto.play.toClient.types.packet_swing_animation = ['container', []]

// Light masks changed to ByteArray
const maskFields = ['skyLightMask', 'blockLightMask', 'emptySkyLightMask', 'emptyBlockLightMask']
for (const field of proto.play.toClient.types.packet_map_chunk[1]) {
  if (maskFields.includes(field.name)) field.type = 'ByteArray'
}
for (const field of proto.play.toClient.types.packet_update_light[1]) {
  if (maskFields.includes(field.name)) field.type = 'ByteArray'
}

// 4. Serverbound Packet Mappings
const playToServerMappings = {
  '0x00': 'teleport_confirm',
  '0x01': 'attack',
  '0x02': 'query_block_nbt',
  '0x03': 'bundle_item_selected',
  '0x04': 'set_difficulty',
  '0x05': 'set_game_mode',
  '0x06': 'chat_ack',
  '0x07': 'chat_command',
  '0x08': 'chat_command_signed',
  '0x09': 'chat_message',
  '0x0a': 'chat_session_update',
  '0x0b': 'chunk_batch_received',
  '0x0c': 'client_command',
  '0x0d': 'client_tick_end',
  '0x0e': 'settings',
  '0x0f': 'tab_complete',
  '0x10': 'configuration_acknowledged',
  '0x11': 'enchant_item',
  '0x12': 'window_click',
  '0x13': 'close_window',
  '0x14': 'container_slot_state_changed',
  '0x15': 'cookie_response',
  '0x16': 'custom_payload',
  '0x17': 'debug_sample_subscription',
  '0x18': 'edit_book',
  '0x19': 'query_entity_nbt',
  '0x1a': 'use_entity',
  '0x1b': 'generate_structure',
  '0x1c': 'keep_alive',
  '0x1d': 'lock_difficulty',
  '0x1e': 'position',
  '0x1f': 'position_look',
  '0x20': 'look',
  '0x21': 'flying',
  '0x22': 'vehicle_move',
  '0x23': 'steer_boat',
  '0x24': 'pick_item',
  '0x25': 'pick_item_from_entity',
  '0x26': 'ping_request',
  '0x27': 'place_recipe',
  '0x28': 'abilities',
  '0x29': 'block_dig',
  '0x2a': 'entity_action',
  '0x2b': 'player_input',
  '0x2c': 'player_loaded',
  '0x2d': 'pong',
  '0x2e': 'recipe_book_settings',
  '0x2f': 'recipe_book',
  '0x30': 'name_item',
  '0x31': 'resource_pack_receive',
  '0x32': 'advancement_tab',
  '0x33': 'select_trade',
  '0x34': 'set_beacon_effect',
  '0x35': 'held_item_slot',
  '0x36': 'update_command_block',
  '0x37': 'update_command_block_minecart',
  '0x38': 'set_creative_slot',
  '0x39': 'set_game_rule',
  '0x3a': 'update_jigsaw_block',
  '0x3b': 'update_structure_block',
  '0x3c': 'set_test_block',
  '0x3d': 'update_sign',
  '0x3e': 'spectate',
  '0x3f': 'arm_animation',
  '0x40': 'teleport_to_entity',
  '0x41': 'test_instance_block_action',
  '0x42': 'block_place',
  '0x43': 'use_item',
  '0x44': 'custom_click_action'
}
proto.play.toServer.types.packet[1][0].type[1].mappings = playToServerMappings

// Serverbound chunk batch received requires an f32 parameter
proto.play.toServer.types.packet_chunk_batch_received = [
  'container',
  [
    { name: 'chunksPerTick', type: 'f32' }
  ]
]

// Serverbound chat_ack requires varint offset
proto.play.toServer.types.packet_chat_ack = [
  'container',
  [
    { name: 'offset', type: 'varint' }
  ]
]

// 26.x player_input schema: 1 byte of input bitflags
proto.play.toServer.types.packet_player_input = [
  'container',
  [
    { name: 'flags', type: 'u8' }
  ]
]

// Register missing schemas for new zero-payload serverbound packets
const missingServerPackets = [
  'packet_attack',
  'packet_bundle_item_selected',
  'packet_chat_command_signed',
  'packet_chat_session_update',
  'packet_client_tick_end',
  'packet_container_slot_state_changed',
  'packet_cookie_response',
  'packet_debug_sample_subscription',
  'packet_pick_item_from_entity',
  'packet_player_loaded',
  'packet_set_game_rule',
  'packet_set_test_block',
  'packet_teleport_to_entity',
  'packet_test_instance_block_action',
  'packet_custom_click_action'
]
for (const p of missingServerPackets) {
  proto.play.toServer.types[p] = ['container', []]
}

if (!proto.play.toServer.types.packet_chat_message && proto.play.toServer.types.packet_chat) {
  proto.play.toServer.types.packet_chat_message = proto.play.toServer.types.packet_chat
}

// Teleport confirm in 26.3 includes coordinates
proto.play.toServer.types.packet_teleport_confirm = [
  'container',
  [
    { name: 'teleportId', type: 'varint' },
    { name: 'x', type: 'f64' },
    { name: 'y', type: 'f64' },
    { name: 'z', type: 'f64' },
    { name: 'yaw', type: 'f32' },
    { name: 'pitch', type: 'f32' }
  ]
]

// Register 26.3 in minecraft-data
data.pc['26.3'] = Object.assign({}, data.pc['26.1'], {
  get protocol () { return proto },
  get version () {
    return {
      version: 777,
      minecraftVersion: '26.3',
      majorVersion: '26.1',
      releaseType: 'release'
    }
  }
})

if (mcData.versionsByMinecraftVersion.pc['26.3']) {
  mcData.versionsByMinecraftVersion.pc['26.3'].majorVersion = '26.1'
}

// Prismarine-chunk loader
const origChunkLoader = require('prismarine-chunk')
const chunk118 = require('prismarine-chunk/src/pc/1.18/chunk')
require.cache[require.resolve('prismarine-chunk')].exports = function (registryOrVersion) {
  const registry = typeof registryOrVersion === 'string' ? require('prismarine-registry')(registryOrVersion) : registryOrVersion
  if (registry?.version?.majorVersion === '26.3' || registry?.version?.minecraftVersion === '26.3') {
    return chunk118(registry)
  }
  return origChunkLoader(registryOrVersion)
}

// Allow mineflayer to accept 26.3
const mfVersion = require('mineflayer/lib/version')
if (!mfVersion.testedVersions.includes('26.3')) {
  mfVersion.testedVersions.push('26.3')
}
mfVersion.latestSupportedVersion = '26.3'

// Suppress protocol misalignment assertions silently
process.on('uncaughtException', (err) => {
  if (
    err.name === 'AssertionError' ||
    err.message?.includes("reading 'id'") ||
    err.message?.includes("setting 'yaw'") ||
    err.message?.includes("reading '_value'") ||
    err.message?.includes('Unexpected buffer end')
  ) {
    return
  }
  console.error('[UNCAUGHT ERROR]', err)
})

// --- Mineflayer Bot Setup ---
const mineflayer = require('mineflayer')
const readline = require('readline')

const rawUsername = process.argv[4] || process.env.MC_USER || 'LebronNoGames'

const config = {
  host: process.argv[2] || process.env.MC_HOST || 'MiHgFN16IN2YTF9V2KJiG6FQmpdA4vOU.eu-ldn.liquidproxy.net',
  port: parseInt(process.argv[3] || process.env.MC_PORT || '25565', 10),
  username: rawUsername.length > 16 ? rawUsername.slice(0, 16) : rawUsername,
  version: process.argv[5] || process.env.MC_VERSION || '1.18.2',
  password: process.env.MC_PASSWORD || 'Lebron123!',
  auth: 'offline'
}

if (rawUsername.length > 16) {
  console.warn(`[Warning] Username '${rawUsername}' exceeds the 16-character limit. Truncated to '${config.username}'.`)
}

const is26Protocol = config.version === '26.3'

let bot = null
let reconnectTimeout = null
let connectWatchdog = null
let keepAliveHeartbeat = null
let isOnServer = false
let isConnecting = false
let hasSpawned = false

let teleportConfirmed = false
let groundY = null
let lastPositionPacket = null
let authSent = false

function formatKickReason (node) {
  if (!node) return 'Unknown reason'
  if (typeof node === 'string') {
    try {
      const parsed = JSON.parse(node)
      return formatKickReason(parsed)
    } catch {
      return node
    }
  }
  if (Array.isArray(node)) {
    return node.map(formatKickReason).filter(Boolean).join(' ')
  }
  if (typeof node === 'object') {
    if (node.value !== undefined) {
      if (typeof node.value === 'string') return node.value
      return formatKickReason(node.value)
    }
    if (node.with) {
      const w = formatKickReason(node.with)
      if (w) return w
    }
    if (node.text) return formatKickReason(node.text)
    if (node.fallback) return formatKickReason(node.fallback)
    if (node.translate) return formatKickReason(node.translate)
    return Object.values(node).map(formatKickReason).filter(Boolean).join(' ')
  }
  return String(node)
}

function stopActions () {
  if (keepAliveHeartbeat) {
    clearInterval(keepAliveHeartbeat)
    keepAliveHeartbeat = null
  }
  if (bot) {
    try {
      bot.clearControlStates()
    } catch {}
  }
}

function cleanupBot () {
  stopActions()
  if (bot) {
    try {
      bot.removeAllListeners()
      if (bot._client) {
        bot._client.removeAllListeners()
        bot._client.end()
      }
    } catch {}
    bot = null
  }
}

function scheduleReconnect () {
  stopActions()
  isOnServer = false
  isConnecting = false

  if (reconnectTimeout) return

  console.log('[Reconnection] Bot is not on the server. Retrying in 10 seconds...')
  reconnectTimeout = setTimeout(() => {
    reconnectTimeout = null
    startBot()
  }, 10000)
}

// Background network heartbeat to keep connection alive without moving
function startActiveHeartbeat () {
  if (keepAliveHeartbeat) clearInterval(keepAliveHeartbeat)
  if (!is26Protocol) return

  keepAliveHeartbeat = setInterval(() => {
    if (!bot || !bot._client || !isOnServer) return

    // 1. Confirm world readiness
    try {
      bot._client.write('player_loaded', {})
    } catch {}

    // 2. Send input flags (0 = no key presses) to prevent idle timeouts
    try {
      bot._client.write('player_input', { flags: 0 })
    } catch {}
  }, 8000)
}

function startBot () {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout)
    reconnectTimeout = null
  }
  if (connectWatchdog) {
    clearTimeout(connectWatchdog)
    connectWatchdog = null
  }

  cleanupBot()

  isConnecting = true
  isOnServer = false
  hasSpawned = false
  teleportConfirmed = false
  groundY = null
  lastPositionPacket = null
  authSent = false

  console.log(`[Connecting] Attempting to join ${config.host}:${config.port} as ${config.username} (version ${config.version})...`)

  try {
    bot = mineflayer.createBot({
      host: config.host,
      port: config.port,
      username: config.username,
      version: config.version,
      auth: config.auth,
      checkTimeoutInterval: 120000,
      hideErrors: true
    })
  } catch (err) {
    console.error('[ERROR] Failed to instantiate bot:', err.message || err)
    scheduleReconnect()
    return
  }

  connectWatchdog = setTimeout(() => {
    if (!isOnServer) {
      console.warn('[Watchdog] Login/Handshake stalled for 25s. Reconnecting...')
      cleanupBot()
      scheduleReconnect()
    }
  }, 25000)

  if (is26Protocol) {
    bot._client.prependListener('position', (packet) => {
      lastPositionPacket = packet
      groundY = packet.y
      if (bot && bot.entity) {
        bot.entity.position.set(packet.x, packet.y, packet.z)
      }
    })

    // Watch for server telling client to wait for chunks and answer when ready
    bot._client.on('game_state_change', (packet) => {
      if (packet && packet.reason === 13) { // 13 = WAITING_FOR_CHUNKS
        setTimeout(() => {
          if (bot && bot._client) {
            try {
              bot._client.write('player_loaded', {})
            } catch {}
          }
        }, 300)
      }
    })

    // Keep bot firmly on the ground without moving
    bot.on('physicsTick', () => {
      if (!bot || !bot.entity || groundY === null) return
      const blockBelow = bot.blockAt ? bot.blockAt(bot.entity.position.offset(0, -0.5, 0)) : null
      if (!blockBelow || blockBelow.boundingBox === 'empty') {
        if (bot.entity.position.y < groundY) {
          bot.entity.position.y = groundY
          bot.entity.velocity.y = Math.max(0, bot.entity.velocity.y)
          bot.entity.onGround = true
        }
      } else if (blockBelow && blockBelow.boundingBox === 'block') {
        groundY = blockBelow.position.y + 1
      }
    })
  }

  // Intercept client writes
  const origWrite = bot._client.write.bind(bot._client)
  bot._client.write = function (name, params = {}) {
    if (!is26Protocol) {
      // XCord VerifyV2 sends PlayerPositionAndLook + KeepAlive in the same TCP flush
      // and expects KeepAlive to be answered before PlayerPositionAndLook (matching Vanilla Netty behavior).
      if (name === 'teleport_confirm' || name === 'position_look') {
        const cloned = Object.assign({}, params)
        setTimeout(() => {
          if (bot && bot._client) {
            try {
              origWrite(name, cloned)
            } catch {}
          }
        }, 15)
        return
      }
      return origWrite(name, params)
    }

    // --- 26.3 specific packet handling ---
    // 1. Ensure chunk_batch_received always sends a valid 32-bit float
    if (name === 'chunk_batch_received') {
      const p = Object.assign({}, params)
      const val = p.chunksPerTick ?? p.desiredChunksPerTick ?? 25.0
      p.chunksPerTick = typeof val === 'number' ? val : 25.0
      return origWrite(name, p)
    }

    // 2. Ensure chat_ack has offset defined
    if (name === 'chat_ack') {
      const p = Object.assign({}, params)
      if (p.offset === undefined) p.offset = 0
      return origWrite(name, p)
    }

    // 3. Drop unhandled container/beacon packets only
    if (name === 'held_item_slot' || name === 'set_beacon_effect') {
      return
    }

    // 4. Safely handle player_input (do not drop; format byte flag)
    if (name === 'player_input') {
      const p = Object.assign({}, params)
      if (p.flags === undefined) p.flags = 0
      return origWrite(name, p)
    }

    // 5. Handle movement and status-only packets (flying)
    if (name === 'look' || name === 'position' || name === 'position_look' || name === 'flying') {
      if (!teleportConfirmed && name !== 'look') {
        return
      }

      if ((name === 'position' || name === 'position_look') &&
          (!Number.isFinite(params.x) || !Number.isFinite(params.y) || !Number.isFinite(params.z))) {
        return
      }

      if (groundY !== null && (name === 'position' || name === 'position_look') && params.y < groundY - 0.5) {
        params.y = groundY
      }

      if (!params.flags || typeof params.flags !== 'object') {
        params.flags = { onGround: params.onGround ?? true }
      } else {
        params.flags.onGround = params.onGround ?? true
      }
      params.onGround = params.onGround ?? true

      const res = origWrite(name, params)

      try {
        origWrite('client_tick_end', {})
      } catch {}

      return res
    }

    // 6. Coordinate synchronization for teleport confirmation + immediate player_loaded
    if (name === 'teleport_confirm') {
      teleportConfirmed = true
      const p = Object.assign({}, params)
      if (p.x === undefined && lastPositionPacket) {
        p.x = lastPositionPacket.x
        p.y = lastPositionPacket.y
        p.z = lastPositionPacket.z
        p.yaw = lastPositionPacket.yaw || 0
        p.pitch = lastPositionPacket.pitch || 0
      }
      const res = origWrite(name, p)

      // Immediately notify the server that the terrain screen is closed
      try {
        origWrite('player_loaded', {})
      } catch {}

      return res
    }

    return origWrite(name, params)
  }

  bot.on('spawn', () => {
    isOnServer = true
    isConnecting = false
    if (connectWatchdog) {
      clearTimeout(connectWatchdog)
      connectWatchdog = null
    }
    if (!hasSpawned) {
      hasSpawned = true
      console.log('[+] Bot successfully spawned and entered the server! (Type in console to chat)')
    } else {
      console.log('[+] Bot transferred to a new world/lobby.')
    }

    // Ensure bot is completely stationary
    bot.clearControlStates()

    if (is26Protocol) {
      // Announce to the server that the world has finished loading
      try {
        bot._client.write('player_loaded', {})
      } catch {}

      // Maintain network heartbeat without any physical movement
      startActiveHeartbeat()
    }
  })

  bot.on('messagestr', (msg, position) => {
    const clean = msg.trim()
    if (!clean || position === 'game_info') return

    if (clean.includes('Verifying your client') || clean.includes('successfully verified')) {
      console.log(`[XCord] ${clean}`)
    } else {
      console.log(`[Chat] ${clean}`)
    }

    // Auto-handle /register password password <captcha> or /login password prompts
    if (!authSent) {
      const regMatch = clean.match(/\/register\s+password\s+password\s+(\S+)/i)
      if (regMatch) {
        authSent = true
        const captcha = regMatch[1]
        setTimeout(() => {
          if (bot) {
            console.log(`[Auth] Registering with captcha ${captcha}...`)
            bot.chat(`/register ${config.password} ${config.password} ${captcha}`)
          }
        }, 1000)
      } else if (/\/login\s+password/i.test(clean)) {
        authSent = true
        setTimeout(() => {
          if (bot) {
            console.log('[Auth] Logging in...')
            bot.chat(`/login ${config.password}`)
          }
        }, 1000)
      }
    }
  })

  bot.on('chat', (username, message) => {
    if (username === bot.username) return
    if (message.trim().toLowerCase() === '!ping') {
      bot.chat('pong!')
    }
  })

  bot.on('kicked', (reason) => {
    isOnServer = false
    stopActions()
    const readable = formatKickReason(reason)
    console.warn(`[!] Bot was kicked:`, readable)
    scheduleReconnect()
  })

  bot.on('error', (err) => {
    if (err.message?.includes("reading '_value'")) return
    console.error(`[ERROR]`, err.message || err)
    isOnServer = false
    scheduleReconnect()
  })

  bot.on('end', () => {
    isOnServer = false
    stopActions()
    console.log('[-] Connection closed.')
    scheduleReconnect()
  })
}

// Forward console input to the bot's chat
const rl = readline.createInterface({
  input: process.stdin
})

rl.on('line', (line) => {
  const text = line.trim()
  if (!text) return
  if (!bot || !isOnServer) {
    console.warn('[!] Cannot send message: Bot is not currently on the server.')
    return
  }
  bot.chat(text)
})

// Background supervisor: Checks every 10s if the bot is absent from the server
setInterval(() => {
  if (!isOnServer && !isConnecting && !reconnectTimeout) {
    console.log('[Supervisor] Bot is not on the server. Attempting connection...')
    startBot()
  }
}, 10000)

process.on('SIGINT', () => {
  stopActions()
  if (reconnectTimeout) clearTimeout(reconnectTimeout)
  if (connectWatchdog) clearTimeout(connectWatchdog)
  cleanupBot()
  process.exit(0)
})

startBot()