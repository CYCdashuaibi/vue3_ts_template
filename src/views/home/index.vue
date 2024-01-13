<template>
  <div>
    <el-card>
      <div class="card-container">
        <el-image
          class="avatar"
          :src="userStore.userInfo.avatar"
          :preview-src-list="[userStore.userInfo.avatar]"
          fit="cover"
        />
        <div>
          <h3 class="time-username">
            {{ `${getTime()}好${userStore.userInfo.name}` }}
          </h3>
          <p class="title">{{ setting.title }}</p>
        </div>
      </div>
    </el-card>
    <svg-icon name="welcome" width="100%" height="100%" class="svg"></svg-icon>
  </div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user'
import { getTime } from '@/utils/time'
import setting from '@/setting'

defineOptions({
  name: 'Home',
})

const userStore = useUserStore()
</script>

<style scoped lang="scss">
.card-container {
  display: flex;
  align-items: center;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-right: 20px;
  }

  .time-username {
    font-size: 20px;
    font-weight: bold;
  }

  .title {
    font-size: 14px;
    font-style: italic;
    margin-top: 15px;
    color: #b5b5b5;
  }
}

.svg {
  margin-top: 50px;
}
</style>
