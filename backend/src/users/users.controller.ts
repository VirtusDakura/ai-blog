import { Controller, Get, Patch, Param, Body, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Public()
    @Get()
    findAll(@Query() query: QueryUsersDto) {
        return this.usersService.findAll({
            skip: query.skip,
            take: query.take,
        });
    }

    @Public()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Public()
    @Get(':id/posts')
    getUserPosts(@Param('id') id: string, @Query() query: QueryUsersDto) {
        return this.usersService.getUserPosts(id, {
            skip: query.skip,
            take: query.take,
        });
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }
}
